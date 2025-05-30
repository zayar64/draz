export type RelationType = "Combo" | "Weak Vs" | "Strong Vs";

export type HeroRelationType = Record<RelationType, HeroType[]>;

export interface HeroType {
    id: number;
    name: string;
    relations?: HeroRelationType;
}
