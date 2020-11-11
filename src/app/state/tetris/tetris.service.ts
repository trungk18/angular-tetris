import { Injectable } from '@angular/core';
import { PieceFactory } from '@trungk18/factory/piece-factory';
import { CallBack } from '@trungk18/interface/callback';
import { GameState } from '@trungk18/interface/game-state';
import { Piece } from '@trungk18/interface/piece/piece';
import { EmptyTile } from '@trungk18/interface/tile/empty-tile';
import { FilledTile } from '@trungk18/interface/tile/filled-tile';
import { Tile } from '@trungk18/interface/tile/tile';
import { MatrixUtil } from '@trungk18/interface/utils/matrix';
import { Subscription, timer } from 'rxjs';
import { TetrisQuery } from './tetris.query';
import { createInitialState, TetrisStore } from './tetris.store';
import { Speed } from '@trungk18/interface/speed';
import { SoundManagerService } from '@trungk18/services/sound-manager.service';
import { LocalStorageService } from '@trungk18/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class TetrisService {
  _gameInterval: Subscription;

  constructor(
    private _store: TetrisStore,
    private _query: TetrisQuery,
    private _soundManager: SoundManagerService,
    private _pieceFactory: PieceFactory
  ) {}

  private get _locked(): boolean {
    return this._query.locked;
  }

  private get _current() {
    return this._query.current;
  }

  private get _next() {
    return this._query.next;
  }

  private get _matrix() {
    return this._query.matrix;
  }

  start() {
    if (!this._current) {
      this._setCurrentPiece(this._next);
      this._setNext();
    }
    let { initLine, initSpeed } = this._query.raw;
    this._store.update({
      points: 0,
      gameState: GameState.Started,
      matrix: MatrixUtil.getStartBoard(initLine),
      speed: initSpeed
    });
    this._unsubscribe();
    this.auto(MatrixUtil.getSpeedDelay(initSpeed));
    this._setLocked(false);
  }

  auto(delay: number) {
    this._gameInterval = timer(0, delay).subscribe(() => {
      this._update();
    });
  }

  resume() {
    let { speed } = this._query.raw;
    this._store.update({
      locked: false,
      gameState: GameState.Started
    });
    this.auto(MatrixUtil.getSpeedDelay(speed));
  }

  pause() {
    this._store.update({
      locked: true,
      gameState: GameState.Paused
    });
    this._unsubscribe();
  }

  reset() {
    this._store.update(createInitialState(this._pieceFactory, { sound: this._query.raw.sound }));
  }

  moveLeft() {
    if (this._locked) {
      return;
    }
    this._clearPiece();
    this._setCurrentPiece(this._current.store());
    this._setCurrentPiece(this._current.moveLeft());
    if (this._isCollidesLeft) {
      this._setCurrentPiece(this._current.revert());
    }
    this._drawPiece();
  }

  moveRight() {
    if (this._locked) {
      return;
    }
    this._clearPiece();
    this._setCurrentPiece(this._current.store());
    this._setCurrentPiece(this._current.moveRight());
    if (this._isCollidesRight) {
      this._setCurrentPiece(this._current.revert());
    }
    this._drawPiece();
  }

  rotate() {
    if (this._locked) {
      return;
    }

    this._clearPiece();
    this._setCurrentPiece(this._current.store());
    this._setCurrentPiece(this._current.rotate());
    while (this._isCollidesRight) {
      this._setCurrentPiece(this._current.moveLeft());
      if (this._isCollidesLeft) {
        this._setCurrentPiece(this._current.revert());
        break;
      }
    }
    this._drawPiece();
  }

  moveDown() {
    this._update();
  }

  drop() {
    if (this._locked) {
      return;
    }
    while (!this._isCollidesBottom) {
      this._clearPiece();
      this._setCurrentPiece(this._current.store());
      this._setCurrentPiece(this._current.moveDown());
    }
    this._setCurrentPiece(this._current.revert());
    this._drawPiece();
  }

  setSound() {
    let sound = this._query.raw.sound;
    this._store.update({
      sound: !sound
    });
  }

  decreaseLevel() {
    let { initSpeed } = this._query.raw;
    let newSpeed = (initSpeed - 1 < 1 ? 6 : initSpeed - 1) as Speed;
    this._store.update({
      initSpeed: newSpeed
    });
  }

  increaseLevel() {
    let { initSpeed } = this._query.raw;
    let newSpeed = (initSpeed + 1 > 6 ? 1 : initSpeed + 1) as Speed;
    this._store.update({
      initSpeed: newSpeed
    });
  }

  increaseStartLine() {
    let { initLine } = this._query.raw;
    let startLine = initLine + 1 > 10 ? 1 : initLine + 1;
    this._store.update({
      initLine: startLine
    });
  }

  decreaseStartLine() {
    let { initLine } = this._query.raw;
    let startLine = initLine - 1 < 1 ? 10 : initLine - 1;
    this._store.update({
      initLine: startLine
    });
  }

  private _update() {
    if (this._locked) {
      return;
    }
    this._setLocked(true);
    this._setCurrentPiece(this._current.revert());
    this._clearPiece();
    this._setCurrentPiece(this._current.store());
    this._setCurrentPiece(this._current.moveDown());

    if (this._isCollidesBottom) {
      this._setCurrentPiece(this._current.revert());
      this._markAsSolid();
      this._drawPiece();
      this._clearFullLines();
      this._setCurrentPiece(this._next);
      this._setNext();
      if (this._isGameOver) {
        this._onGameOver();
        return;
      }
    }

    this._drawPiece();
    this._setLocked(false);
  }

  private _clearFullLines() {
    let numberOfClearedLines = 0;
    let newMatrix = [...this._matrix];
    for (let row = MatrixUtil.Height - 1; row >= 0; row--) {
      let pos = row * MatrixUtil.Width;
      let fullRowTiles = newMatrix.slice(pos, pos + MatrixUtil.Width);
      let isFullRow = fullRowTiles.every((x) => x.isSolid);
      if (isFullRow) {
        numberOfClearedLines++;
        let topPortion = this._matrix.slice(0, row * MatrixUtil.Width);
        newMatrix.splice(0, ++row * MatrixUtil.Width, ...MatrixUtil.EmptyRow.concat(topPortion));
        this._setMatrix(newMatrix);
      }
    }
    this._setPointsAndSpeed(numberOfClearedLines);
  }

  private get _isGameOver() {
    this._setCurrentPiece(this._current.store());
    this._setCurrentPiece(this._current.moveDown());
    if (this._isCollidesBottom) {
      return true;
    }
    this._setCurrentPiece(this._current.revert());
    return false;
  }

  private _onGameOver() {
    this.pause();
    this._soundManager.gameOver();
    let { points, max } = this._query.raw;
    let maxPoint = Math.max(points, max);
    LocalStorageService.setMaxPoint(maxPoint);
    this._store.update({
      ...createInitialState(this._pieceFactory, { sound: this._query.raw.sound }),
      max: maxPoint,
      gameState: GameState.Over
    });
  }

  private get _isCollidesBottom(): boolean {
    if (this._current.bottomRow >= MatrixUtil.Height) {
      return true;
    }
    return this._collides();
  }

  private get _isCollidesLeft(): boolean {
    if (this._current.leftCol < 0) {
      return true;
    }
    return this._collides();
  }

  private get _isCollidesRight(): boolean {
    if (this._current.rightCol >= MatrixUtil.Width) {
      return true;
    }
    return this._collides();
  }

  private _collides(): boolean {
    return this._current.positionOnGrid.some((pos) => {
      if (this._matrix[pos].isSolid) {
        return true;
      }
      return false;
    });
  }

  private _drawPiece() {
    this._setCurrentPiece(this._current.clearStore());
    this._loopThroughPiecePosition((position) => {
      let isSolid = this._matrix[position].isSolid;
      this._updateMatrix(position, new FilledTile(isSolid));
    });
  }

  private _markAsSolid() {
    this._loopThroughPiecePosition((position) => {
      this._updateMatrix(position, new FilledTile(true));
    });
  }

  private _clearPiece() {
    this._loopThroughPiecePosition((position) => {
      this._updateMatrix(position, new EmptyTile());
    });
  }

  private _loopThroughPiecePosition(callback: CallBack<number>) {
    this._current.positionOnGrid.forEach((position) => {
      callback(position);
    });
  }

  private _setPointsAndSpeed(numberOfClearedLines: number) {
    if (!numberOfClearedLines) {
      return;
    }
    this._soundManager.clear();
    let { points, clearedLines, speed, initSpeed } = this._query.raw;
    let newLines = clearedLines + numberOfClearedLines;
    let newPoints = this._getPoints(numberOfClearedLines, points);
    let newSpeed = this._getSpeed(newLines, initSpeed);

    this._store.update({
      points: newPoints,
      clearedLines: newLines,
      speed: newSpeed
    });

    if (newSpeed !== speed) {
      this._unsubscribe();
      this.auto(MatrixUtil.getSpeedDelay(newSpeed));
    }
  }

  private _getSpeed(totalLines: number, initSpeed: number): Speed {
    let addedSpeed = Math.floor(totalLines / MatrixUtil.Height);
    let newSpeed = <Speed>(initSpeed + addedSpeed);
    newSpeed = newSpeed > 6 ? 6 : newSpeed;
    return newSpeed;
  }

  private _getPoints(numberOfClearedLines: number, points: number): number {
    let addedPoints = MatrixUtil.Points[numberOfClearedLines - 1];
    let newPoints = points + addedPoints;
    return newPoints > MatrixUtil.MaxPoint ? MatrixUtil.MaxPoint : newPoints;
  }

  private _updateMatrix(pos: number, tile: Tile) {
    let newMatrix = [...this._matrix];
    newMatrix[pos] = tile;
    this._setMatrix(newMatrix);
  }

  private _setNext() {
    this._store.update({
      next: this._pieceFactory.getRandomPiece()
    });
  }

  private _setCurrentPiece(piece: Piece) {
    this._store.update({
      current: piece
    });
  }

  private _setMatrix(matrix: Tile[]) {
    this._store.update({
      matrix
    });
  }

  private _setLocked(locked: boolean) {
    this._store.update({
      locked
    });
  }

  private _unsubscribe() {
    this._gameInterval && this._gameInterval.unsubscribe();
  }
}
