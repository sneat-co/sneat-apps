export enum PetKinds {
  dog = 'dog',
  cat = 'cat',
  hamster = 'hamster',
  rabbit = 'rabbit',
  bird = 'bird',
  fish = 'fish',
  turtle = 'turtle',
  snake = 'snake',
  lizard = 'lizard',
  horse = 'horse',
  pig = 'pig',
  cow = 'cow',
}

export type PetKind = keyof typeof PetKinds;
