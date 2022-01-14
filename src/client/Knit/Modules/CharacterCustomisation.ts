import { ReplicatedStorage } from "@rbxts/services"

interface characterInterface {
  Hair: number;
  HairColour: number;
  Eyes: number;
  EyeColour: number;
  Mouth: number;
  Shirt: number;
  ShirtColour: number;
  Pants: number;
  PantsColour: number;
  Shoes: number;
  ShoeColour: number;
}

const CharacterCustomItems = ReplicatedStorage.Assets.CharacterCustomItems

const itemFunctions = new Map<string, (item: string, itemNumber: number, colourBased: boolean) => void>()
itemFunctions.set("Face", (item: string, itemNumber: number, colourBased: boolean) => {
  
})
itemFunctions.set("Clothing", (item: string, itemNumber: number, colourBased: boolean) => {
  
})
itemFunctions.set("Head", (item: string, itemNumber: number, colourBased: boolean) => {
  
})

export = (actor: Model, data: characterInterface) => {
  for (const [item, itemNumber] of data) {
    if (item === "Eyes" || item === "Mouth") {
      itemFunctions.get("Face")(item, itemNumber, item.find("Colour"))
    } else if (item === "Shirt" || item === "Pants" || item === "Shoes") {
      itemFunctions.get("Clothing")(item, itemNumber, item.find("Colour"))
    } else if (item === "Hair") {
      itemFunctions.get("Head")(item, itemNumber, item.find("Colour"))
    }
  }
}
