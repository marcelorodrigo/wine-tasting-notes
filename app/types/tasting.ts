/**
 * Mirrors the current WSET SAT specification in app/data/wset-sat-spec.json.
 * Keep this file aligned with the canonical spec until automated generation is added.
 */
export type Nullable<T> = T | null

export type WineType = 'white' | 'rosé' | 'red'

export type Clarity = 'clear' | 'hazy'
export type AppearanceIntensity = 'pale' | 'medium' | 'deep'
export type WhiteWineColor = 'lemon-green' | 'lemon' | 'gold' | 'amber' | 'brown'
export type RoseWineColor = 'pink' | 'salmon' | 'orange'
export type RedWineColor = 'purple' | 'ruby' | 'garnet' | 'tawny' | 'brown'
export type Color = WhiteWineColor | RoseWineColor | RedWineColor
export type OtherObservation = 'legs/tears' | 'deposit' | 'pétillance' | 'bubbles'

export type NoseCondition = 'clean' | 'unclean'
export type NoseIntensity = 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'pronounced'
export type NoseDevelopment = 'youthful' | 'developing' | 'fully developed' | 'tired/past its best'

export type Sweetness = 'dry' | 'off-dry' | 'medium-dry' | 'medium-sweet' | 'sweet' | 'luscious'
export type Acidity = 'low' | 'medium(-)' | 'medium' | 'medium(+)' | 'high'
export type Tannin = 'low' | 'medium(-)' | 'medium' | 'medium(+)' | 'high'
export type Alcohol = 'low' | 'medium' | 'high'
export type Fortified = boolean
export type Body = 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'full'
export type Mousse = 'delicate' | 'creamy' | 'aggressive'
export type FlavorIntensity = 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'pronounced'
export type Finish = 'short' | 'medium(-)' | 'medium' | 'medium(+)' | 'long'

export type QualityLevel = 'faulty' | 'poor' | 'acceptable' | 'good' | 'very good' | 'outstanding'
export type Readiness = 'too young' | 'can drink now, but has potential for ageing' | 'drink now: not suitable for ageing or further ageing' | 'too old'

export type FloralDescriptor = 'acacia' | 'honeysuckle' | 'chamomile' | 'elderflower' | 'geranium' | 'blossom' | 'rose' | 'violet'
export type GreenFruitDescriptor = 'apple' | 'gooseberry' | 'pear' | 'pear drop' | 'quince' | 'grape'
export type CitrusFruitDescriptor = 'grapefruit' | 'lemon' | 'lime' | 'orange peel' | 'lemon peel'
export type StoneFruitDescriptor = 'peach' | 'apricot' | 'nectarine'
export type TropicalFruitDescriptor = 'banana' | 'lychee' | 'mango' | 'melon' | 'passion fruit' | 'pineapple'
export type RedFruitDescriptor = 'redcurrant' | 'cranberry' | 'raspberry' | 'strawberry' | 'red cherry' | 'red plum'
export type BlackFruitDescriptor = 'blackcurrant' | 'blackberry' | 'bramble' | 'blueberry' | 'black cherry' | 'black plum'
export type DriedCookedFruitDescriptor = 'fig' | 'prune' | 'raisin' | 'sultana' | 'kirsch' | 'jamminess' | 'baked/stewed fruits' | 'preserved fruits'
export type HerbaceousDescriptor = 'green bell pepper (capsicum)' | 'grass' | 'tomato leaf' | 'asparagus' | 'blackcurrant leaf'
export type HerbalDescriptor = 'eucalyptus' | 'mint' | 'medicinal' | 'lavender' | 'fennel' | 'dill'
export type PungentSpiceDescriptor = 'black/white pepper' | 'liquorice'
export type OtherDescriptor = 'flint' | 'wet stones' | 'wet wool'

export type YeastDescriptor = 'biscuit' | 'bread' | 'toast' | 'pastry' | 'brioche' | 'bread dough' | 'cheese'
export type MalolacticConversionDescriptor = 'butter' | 'cheese' | 'cream'
export type OakDescriptor = 'vanilla' | 'cloves' | 'nutmeg' | 'coconut' | 'butterscotch' | 'toast' | 'cedar' | 'charred wood' | 'smoke' | 'chocolate' | 'coffee' | 'resinous'

export type DeliberateOxidationDescriptor = 'almond' | 'marzipan' | 'hazelnut' | 'walnut' | 'chocolate' | 'coffee' | 'toffee' | 'caramel'
export type FruitDevelopmentWhiteDescriptor = 'dried apricot' | 'marmalade' | 'dried apple' | 'dried banana'
export type FruitDevelopmentRedDescriptor = 'fig' | 'prune' | 'tar' | 'dried blackberry' | 'dried cranberry' | 'cooked blackberry' | 'cooked red plum'
export type BottleAgeWhiteDescriptor = 'petrol' | 'kerosene' | 'cinnamon' | 'ginger' | 'nutmeg' | 'toast' | 'nutty' | 'mushroom' | 'hay' | 'honey'
export type BottleAgeRedDescriptor = 'leather' | 'forest floor' | 'earth' | 'mushroom' | 'game' | 'tobacco' | 'vegetal' | 'wet leaves' | 'savoury' | 'meaty' | 'farmyard'

export interface PrimaryAromaSelections {
  floral: FloralDescriptor[]
  greenFruit: GreenFruitDescriptor[]
  citrusFruit: CitrusFruitDescriptor[]
  stoneFruit: StoneFruitDescriptor[]
  tropicalFruit: TropicalFruitDescriptor[]
  redFruit: RedFruitDescriptor[]
  blackFruit: BlackFruitDescriptor[]
  driedCookedFruit: DriedCookedFruitDescriptor[]
  herbaceous: HerbaceousDescriptor[]
  herbal: HerbalDescriptor[]
  pungentSpice: PungentSpiceDescriptor[]
  other: OtherDescriptor[]
}
export type PrimaryAromaCategory = keyof PrimaryAromaSelections

export interface SecondaryAromaSelections {
  yeast: YeastDescriptor[]
  malolacticConversion: MalolacticConversionDescriptor[]
  oak: OakDescriptor[]
}
export type SecondaryAromaCategory = keyof SecondaryAromaSelections

export interface TertiaryAromaSelections {
  deliberateOxidation: DeliberateOxidationDescriptor[]
  fruitDevelopmentWhite: FruitDevelopmentWhiteDescriptor[]
  fruitDevelopmentRed: FruitDevelopmentRedDescriptor[]
  bottleAgeWhite: BottleAgeWhiteDescriptor[]
  bottleAgeRed: BottleAgeRedDescriptor[]
}
export type TertiaryAromaCategory = keyof TertiaryAromaSelections

export interface AromaObject {
  primary: PrimaryAromaSelections
  secondary: SecondaryAromaSelections
  tertiary: TertiaryAromaSelections
}

export interface AppearanceData {
  wineType: Nullable<WineType>
  clarity: Nullable<Clarity>
  intensity: Nullable<AppearanceIntensity>
  color: Nullable<Color>
  otherObservations: Nullable<OtherObservation[]>
}

export interface NoseData {
  condition: Nullable<NoseCondition>
  intensity: Nullable<NoseIntensity>
  development: Nullable<NoseDevelopment>
  aromas: Nullable<AromaObject>
}

export interface PalateData {
  sweetness: Nullable<Sweetness>
  acidity: Nullable<Acidity>
  tannin: Nullable<Tannin>
  alcohol: Nullable<Alcohol>
  fortified: Nullable<Fortified>
  body: Nullable<Body>
  mousse: Nullable<Mousse>
  flavorIntensity: Nullable<FlavorIntensity>
  flavors: Nullable<AromaObject>
  finish: Nullable<Finish>
}

export interface ConclusionsData {
  qualityLevel: Nullable<QualityLevel>
  readiness: Nullable<Readiness>
}

export interface TastingData {
  appearance: AppearanceData
  nose: NoseData
  palate: PalateData
  conclusions: ConclusionsData
}
