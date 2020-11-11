# Angular Tetris

A childhood memory Tetris game built with Angular 10 and Akita.

<details>
  <summary>Table Of Content</summary>
  <p>

- [Angular Tetris](#angular-tetris)
  - [Working Game](#working-game)
  - [Support](#support)
  - [Why?](#why)
  - [Who is this for?](#who-is-this-for)
  - [How to play](#how-to-play)
    - [Before playing](#before-playing)
    - [Playing game](#playing-game)
  - [Techstack](#techstack)
  - [Development Challenge](#development-challenge)
    - [Tetris Core](#tetris-core)
    - [Akita state management + dev tool support](#akita-state-management--dev-tool-support)
    - [Customizing Piece](#customizing-piece)
    - [Animation](#animation)
    - [Web Audio API](#web-audio-api)
    - [Keyboard handling](#keyboard-handling)
    - [Service Worker](#service-worker)
      - [What's being cached?](#whats-being-cached)
  - [Features and Roadmap](#features-and-roadmap)
    - [Phase 1 - Angular Tetris basic functionality](#phase-1---angular-tetris-basic-functionality)
    - [Phase 2 - Firebase high score, service worker, more sounds effect, more animation](#phase-2---firebase-high-score-service-worker-more-sounds-effect-more-animation)
  - [Time spending](#time-spending)
  - [Setting up development environment 🛠](#setting-up-development-environment-)
  - [Author: Trung Vo ✍️](#author-trung-vo-️)
  - [Credits and references](#credits-and-references)
  - [Contributing](#contributing)
  - [License](#license)
  </p>
  </details>

## Working Game

Check out the **working game** -> https://tetris.trungk18.com

The game has sounds, wear your 🎧 or turn on your 🔊 for a better experience.

![A childhood memory Tetris game built with Angular 10 and Akita][demo]

> Please tweet and tag me @tuantrungvo for any issues that you are currently facing!
> Thanks for your understanding. Stay tuned!

![A childhood memory Tetris game built with Angular 10 and Akita][iphonex]

## Support

If you like my work, feel free to:

- ⭐ this repository. And we will be happy together :)
- [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)][tweet] about Angular Tetris
- <a title="Thanks for your support!" href="https://www.buymeacoffee.com/tuantrungvo" target="_blank"><img src="https://res.cloudinary.com/dvujyxh7e/image/upload/c_thumb,w_140,g_face/v1596378474/default-orange_uthxgz.jpg" alt="Buy Me A Coffee"></a>

Thanks a bunch for stopping by and supporting me!

[tweet]: https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Ftrungk18%2Fangular-tetris&text=Awesome%20Tetris%20game%20built%20with%20Angular%2010%20and%20Akita%2C%20can%20you%20get%20999999%20points%3F&hashtags=angular,angulartetris,akita,typescript

## Why?

Tetris was the first game that my dad bought for me and It cost about 1$ US at that time. It didn't sound a lot today. But 20 years ago, 1$ can feed my family for at least a few days. Put it that way, with 1\$ you can buy two dozens eggs.
This is the only gaming "machine" that I ever had until my first computer arrived. I have never had a SNES or PS1 at home.

My Tetris was exactly in the same yellow color and it was so big, running on 2 AA battery. It is how it looks.

![Retro Tetris][tetris]

After showing my wife the [Tetris game built with Vue][vue]. She asked me why I didn't build the same <u>Tetris with Angular</u>? And here you go.

> The game can hold up to a maximum score of 999999 (one million minus one 😂) and I have never reached that very end.
>
> Please [tweet][tweetmax] the screenshot with your highest score, together with hashtag `#angulartetris` and my name tagged as well `@tuantrungvo`. I will send **a free gift** to the one having the highest score of the day, from now till <u>1 Aug 2020</u>.

[tweetmax]: https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Ftrungk18%2Fangular-tetris&text=Woo-hoo!%20I%20got%20a%20999999%20points%20on%20Angular%20Tetris%20%40tuantrungvo.%20Wanna%20join%20the%20party%3F%20&hashtags=angular,angulartetris,akita,typescript

## Who is this for?

I built this game dedicated to:

- For anyone that grew up with Tetris as a part of your memory. It was my childhood memory and I hope you enjoy the game as well.
- For the Angular developer community, I have never really seen a game that built with Angular and that's my answer. Using Akita as the underlying state management helps me to see all of the data flow, it is great for debugging. I wanted to see more Angular game from you guys 💪💪💪

## How to play

### Before playing

- You can use both keyboard and mouse to play. But prefer to use <u>keyboard</u>
- Press arrow left and right to change the speed of the game **(1 - 6)**. The higher the number, the faster the piece will fall
- Press arrow up and down to change how many of lines have been filled before starting the game **(1 - 10)**
- Press `Space` to start the game
- Press `P` for pause/resume game
- Press `R` for resetting the game
- Press `S` for the turn on/off the sounds

### Playing game

- Press `Space` make the piece drop quickly
- Press `Arrow left` and `right` for moving left and right
- Press `Arrow up` to rotate the piece
- Press `Arrow down` to move a piece faster
- When clearing lines, you will receive a point - 100 points for 1 line, 300 points for 2 lines, 700 points for 3 lines, 1500 points for 4 lines
- The drop speed of the pieces increases with the number of rows eliminated (one level up for every 20 lines cleared)

## Techstack

I built it barely with Angular and Akita, no additional UI framework/library was required.

![Angular Tetris][techstack]

## Development Challenge

I got the inspiration from the same but different [Tetris game built with Vue][vue]. To not reinvented the wheel, I started to look at Vue code and thought it would be very identical to Angular. But later one, I realized a few catches:

- The Vue source code was written a few years ago with pure JS. I could find several problems that the compiler didn't tell you. Such as giving `parseInt` a number. It is still working though, but I don't like it.
- There was extensive use of `setTimeout` and `setInterval` for making animations. I rewrote all of the animation logic using RxJS. You will see the detail below.
- The brain of the game also used `setTimeout` for the game loop. It was not a problem, but I was having a <u>hard time</u> understanding the code on some essential elements: how to render the piece to the UI, how the calculation makes sense with XY axis. In the end, I changed all of the logic to a proper OOP way using TypeScript class, based on [@chrum/ngx-tetris][ngx-tetris].

### Tetris Core

It is the most important part of the game. As I am following the Vue source code, It is getting harder to understand what was the developer's intention. The Vue version inspired me but I think I have to write the core Tetris differently.

Take a look at the two blocks of code below which do the same rendering piece on the screen and you will understand what I am talking about. The left side was rewritten with Angular and TypeScript and the right side was the JS version.

![Angular Tetris][compare01]

I always think that your code must be written as you talk to people, without explaining a word. Otherwise, when someone comes in and reads your code and maintains it, they will be struggling.

> “ Code is like humor. When you have to explain it, it’s bad.” – Cory House

And let me emphasize it again, I didn't write the brain of the game from scratch. I adapted the well-written source by [@chrum/ngx-tetris][ngx-tetris] for Tetris core. I did refactor some parts to support Akita and wrote some new functionality as well.

### Akita state management + dev tool support

Although you don't dispatch any action, Akita will still do it undo the hood as the Update action. And you still can see the data with [Redux DevTools][redux-devtool]. Remember to put that option into your `AppModule`

```ts
imports: [environment.production ? [] : AkitaNgDevtools.forRoot()];
```

I turn it on all the time on [tetris.trungk18.com][angular-tetris], you can open the DevTools and start seeing the data flow.

![Angular Tetris][akita-devtool]

> Note: opening the DevTools could reduce the performance of the game significantly. I recommended you turn it off when you want to archive a high score 🤓

### Customizing Piece

I defined a base [Piece class][piece-class] for a piece. And for each type of piece, it will extend from the same base class to inherit the same capability

[piece-class]: src/app/interface/piece/piece.ts

```ts
export class Piece {
  x: number;
  y: number;
  rotation = PieceRotation.Deg0;
  type: PieceTypes;
  shape: Shape;
  next: Shape;

  private _shapes: Shapes;
  private _lastConfig: Partial<Piece>;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  store(): Piece {
    this._lastConfig = {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      shape: this.shape
    };
    return this._newPiece();
  }

  //code removed for brevity
}
```

For example, I have a piece L. I create a new class name [PieceL][piecel]. I will contain the shape of L in four different rotation so that I don't have to mess up with the math to do minus plus on the XY axis. And I think defining in that way makes the code self-express better. If you see 1, it means on the matrix it will be filled, 0 mean empty tile.

If my team member needs to maintain the code, I hope he will understand what I was trying to write immediately. Or maybe not 🤣

One import property of the Piece is the `next` property to display the piece shape on the decoration box for the upcoming piece.

[piecel]: src/app/interface/piece/L.ts

```ts
const ShapesL: Shapes = [];
ShapesL[PieceRotation.Deg0] = [
  [0, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 1, 0, 0]
];

ShapesL[PieceRotation.Deg90] = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 1, 1, 0],
  [1, 0, 0, 0]
];
//code removed for brevity

];

export class PieceL extends Piece {
  constructor(x: number, y: number) {
    super(x, y);
    this.type = PieceTypes.L;
    this.next = [
      [0, 0, 1, 0],
      [1, 1, 1, 0]
    ];
    this.setShapes(ShapesL);
  }
}
```

Now is the interesting part, you create a custom piece by yourself. Simply create a new class that extends from `Piece` with different rotations.

For instance, I will define a new piece call F with class name [`PieceF`][piecef]. That is how it should look like.

[piecef]: https://github.com/trungk18/angular-tetris/blob/feature/pieceF/src/app/interface/piece/F.ts

```ts
const ShapesF: Shapes = [];
ShapesF[PieceRotation.Deg0] = [
  [1, 0, 0, 0],
  [1, 1, 0, 0],
  [1, 0, 0, 0],
  [1, 1, 0, 0]
];

export class PieceF extends Piece {
  constructor(x, y) {
    super(x, y);
    this.type = PieceTypes.F;
    this.next = [
      [1, 0, 1, 0],
      [1, 1, 1, 1]
    ];
    this.setShapes(ShapesF);
  }
}
```

And the last step, go to [PieceFactory][piecefactory] to add the new PieceF into the available pieces.

[piecefactory]: src/app/factory/piece-factory.ts

```ts
export class PieceFactory {
  private _available: typeof Piece[] = [];

  constructor() {
    //code removed for brevity
    this._available.push(PieceF);
  }
}
```

And you're all set, this is the result. See how easy it is to understand the code and add a custom piece that you like.

The source code for that custom piece F, you can see at [feature/pieceF][feature/piecef] branch.

![Angular Tetris Piece F][piecef-demo]

[feature/piecef]: https://github.com/trungk18/angular-tetris/tree/feature/pieceF
[piecef-demo]: src/assets/readme/piecef-demo.gif

### Animation

I rewrote the animation with RxJS. See the comparison below for the simple dinosaurs running animation at the beginning of the game.

You could do a lot of stuff if you know RxJS well enough :) I think I need to strengthen my RxJS knowledge soon enough as well. Super powerful.

![Angular Tetris][compare02]

The actual result doesn't look very identical but it is good enough in my standard.

![Angular Tetris][compare02-result]

### Web Audio API

There are many sound effects in the game such as when you press space, or left, right. In reality, all of the sounds were a reference to a single file [assets/tetris-sound.mp3][sounds].

I don't have much experience working with audio before but the Web Audio API looks very promising. You could do more with it.

- See the [official documentation][webaudio]
- See how I load the mp3 file and store it in [sound-manager.service.ts][sound-manager]
- [Writing Web Audio API code that works in every browser][web_audio_api_cross_browser]

### Keyboard handling

I planned to use [@ngneat/hotkeys][hotkeys] but I decided to use `@HostListener` instead. A simple implementation could look like:

```typescript
@HostListener(`${KeyDown}.${TetrisKeyboard.Left}`)
keyDownLeft() {
  this._soundManager.move();
  this._keyboardService.setKeỵ({
    left: true
  });
  if (this.hasCurrent) {
    this._tetrisService.moveLeft();
  } else {
    this._tetrisService.decreaseLevel();
  }
}
```

See more at [containers/angular-tetris/angular-tetris.component.ts][hotkeys-implementation]

### Service Worker

I follow the [Angular service worker guide][service-worker] to enable Angular service worker support in my project created with the Angular CLI. I simply run

```bash
ng add @angular/pwa
```

And then update some icons and static files. Then that's all set, I can start to play game without having an internet connection.



#### What's being cached?

Notice that all of the files the browser needs to render this application are cached. The `ngsw-config.json` boilerplate configuration is set up to cache the specific resources used by the CLI:

- index.html.
- favicon.ico.
- Build artifacts (JS and CSS bundles).
- Anything under assets.

[service-worker]: https://angular.io/guide/service-worker-getting-started

## Features and Roadmap

### Phase 1 - Angular Tetris basic functionality

> July 10 - 23, 2020

- [x] Proven, scalable, and easy to understand project structure
- [x] Basic Tetris functionality
- [x] Six levels
- [x] Local storage high score
- [x] Sounds effects
- [x] Limited mobile support

### Phase 2 - Firebase high score, service worker, more sounds effect, more animation

> TBD

- [ ] Fully mobile support
- [x] Offline mode (play without internet connection)
- [ ] Firebase high score
- [ ] More sound effects
- [ ] More animations

## Time spending

I was still working with [Chau Tran][chautran] on phase two of [Angular Jira clone][jira-clone] when I saw that Tetris game built with Vue. My wife wanted to have a version that I built so that I decided to finish the Angular Tetris first before completing Jira clone phase two.

According to waka time report, I have spent about 30 hours working on this project. Which is equal to [run a marathon five times][marathon] at my current speed 😩

![Angular Tetris][timespending]

The flow was easy. I designed a simple [to do list][todolist], then start reading the code in Vue. And start working on the Angular at the same time. Halfway, I start to read [@chrum/ngx-tetris][ngx-tetris] instead of the Vue source. And keep building until I have the final result. 30 hours was a good number. It would take me longer, or lesser. But I enjoyed the experience working on the first-ever game I have built.

## Setting up development environment 🛠

- `git clone https://github.com/trungk18/angular-tetris.git`
- `cd angular-tetris`
- `npm start`
- The app should run on `http://localhost:4200/`

## Author: Trung Vo ✍️

- A young and passionate front-end engineer. Working with Angular and TypeScript. Like photography, running, cooking, and reading books.
- Author of Angular Jira clone -> [jira.trungk18.com][jira-clone]
- Personal blog: https://trungk18.com/
- Say hello: trungk18 [et] gmail [dot] com

## Credits and references

| Resource                                      | Description                                                                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [@Binaryify/vue-tetris][vue]                  | Vue Tetris, I reused part of HTML, CSS and static assets from that project                                                        |
| [@chrum/ngx-tetris][ngx-tetris]               | A comprehensive core Tetris written with Angular, I reused part of that for the brain of the game.                                |
| [Game Development: Tetris in Angular][medium] | A detailed excellent article about how to build a complete Tetris game. I didn't check the code but I learned much more from that |
| [Super Rotation System][srs]                  | A standard for how the piece behaves. I didn't follow everything but it is good to know as wells                                  |

## Contributing

If you have any ideas, just [open an issue][issues] and tell me what you think.

If you'd like to contribute, please fork the repository and make changes as you'd like. [Pull requests][pull] are warmly welcome.

## License

Feel free to use my code on your project. It would be great if you put a reference to this repository.

[MIT](https://opensource.org/licenses/MIT)

[issues]: https://github.com/trungk18/angular-tetris/issues/new/choose
[pull]: https://github.com/trungk18/angular-tetris/pulls
[angular-tetris]: https://tetris.trungk18.com
[medium]: https://medium.com/angular-in-depth/game-development-tetris-in-angular-64ef96ce56f7
[srs]: https://tetris.fandom.com/wiki/SRS
[vue]: https://github.com/Binaryify/vue-tetris
[tetris]: src/assets/readme/retro-tetris.jpg
[demo]: src/assets/readme/angular-tetris-demo.gif
[iphonex]: src/assets/readme/angular-tetris-iphonex.gif
[ngx-tetris]: https://github.com/chrum/ngx-tetris
[techstack]: src/assets/readme/tech-stack.png
[compare01]: src/assets/readme/compare01.png
[compare02]: src/assets/readme/compare02.png
[compare02-result]: src/assets/readme/compare02-result.gif
[timespending]: src/assets/readme/time-spending.png
[akita-devtool]: src/assets/readme/akita-devtool.gif
[sounds]: src/assets/tetris-sound.mp3
[sound-manager]: src/app/services/sound-manager.service.ts
[webaudio]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
[redux-devtool]: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en
[hotkeys]: https://github.com/ngneat/hotkeys
[hotkeys-implementation]: src/app/containers/angular-tetris/angular-tetris.component.ts
[chautran]: https://github.com/nartc
[jira-clone]: https://github.com/trungk18/jira-clone-angular
[marathon]: https://www.strava.com/activities/2902245728
[todolist]: https://www.notion.so/trungk18/Phase-1-be1ae0fbbf2c4c2fb92887e2218413db
[web_audio_api_cross_browser]: https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Web_Audio_API_cross_browser
