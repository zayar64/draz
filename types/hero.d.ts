export interface HeroType {
    id: number;
    name: string;
    image: string;
    relations?: Record<RelationType, HeroType[]>;
}

export interface HeroRelationType {
    mainHeroId: number;
    targetHeroId: number;
    relationType: RelationType;
}