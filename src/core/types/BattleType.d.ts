// types.d.ts

export interface Modifier {
    id: string;
    source: string;
    attackPower: number;
    defensePower: number;
}

export interface Card {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    type: string;
    element: string;
    attribute: string;
    stars: number;
    attackPower: number;
    defensePower: number;
    effectScript: string;
    effectValue: any;
    modifiers: Modifier[];
}

export interface SpellCard extends Card {
    attribute: string;
    effectScript: string;
    effectValue: {
        points?: number;
        target?: string;
        turns?: number;
        [key: string]: any;
    };
}

export interface Field {
    card: Card | SpellCard;
    position: 'attack' | 'defense';
    canAttack: boolean;
    isFaceDown?: boolean;
    activationTurn?: number;
}

export interface BattleState {
    player: Player;
    opponent: Player;
    environment: {
        activeField: {
            id: string;
            name: string;
            type: string;
            effects: Array<{
                target: { type: string };
                modifiers: { atk: number; def: number };
            }>;
        } | null;
    };
    turn: number;
    currentTurnOwner: 'player' | 'opponent';
    pendingAction?: {
        cardHandIndex: number;
        effectId: string;
        targetType: string;
    };
}

export interface Player {
    id: number | string;
    name: string;
    hp: number;
    hand: Card[];
    deck: Card[];
    field: Field[];
    spells: Field[];
    graveyard: Card[];
    deckCount: number;
    canSummon?: boolean;
    handCount?: number;
}

export interface PlayerClient extends Omit<Player, 'deck'> {
    deck?: never;
    deckCount: number;
}

export interface OpponentClient extends Omit<Player, 'deck' | 'hand'> {
    deck?: never;
    hand?: never;
    handCount: number;
    deckCount: number;
}

export interface BattleStateClient {
    player: PlayerClient;
    opponent: OpponentClient;
    environment: BattleState['environment'];
    turn: number;
    currentTurnOwner: 'player' | 'opponent';
}
