import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { PieceFactory } from '@trungk18/factory/piece-factory';
import { GameState } from '@trungk18/interface/game-state';
import { Piece } from '@trungk18/interface/piece/piece';
import { Tile } from '@trungk18/interface/tile/tile';
import { MatrixUtil } from '@trungk18/interface/utils/matrix';
import { Speed } from '@trungk18/interface/speed';
import { LocalStorageService } from '@trungk18/services/local-storage.service';

export interface TetrisState {
  matrix: Tile[];
  current: Piece;
  next: Piece;
  points: number;
  locked: boolean;
  sound: boolean;
  initSpeed: Speed;
  speed: Speed;
  initLine: number;
  clearedLines: number;
  gameState: GameState;
  saved: TetrisState;
  max: number;
}

export function createInitialState(
  pieceFactory: PieceFactory,
  currentState: Partial<TetrisState> = { sound: true }
): TetrisState {
  return {
    matrix: MatrixUtil.getStartBoard(),
    current: null,
    next: pieceFactory.getRandomPiece(),
    points: 0,
    locked: true,
    sound: true,
    initLine: 0,
    clearedLines: 0,
    initSpeed: 1,
    speed: 1,
    gameState: GameState.Loading,
    saved: null,
    max: LocalStorageService.maxPoint,
    ...currentState
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'AngularTetris' })
export class TetrisStore extends Store<TetrisState> {
  constructor(_pieceFactory: PieceFactory) {
    super(createInitialState(_pieceFactory));
  }
}
