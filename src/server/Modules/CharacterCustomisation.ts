import { ReplicatedStorage } from "@rbxts/services"

interface appearanceInterface {
	Hair: number
	HairColour: number
	Eyes: number
	EyeColour: number
	Mouth: number
	Shirt: number
	ShirtColour: number
	Pants: number
	PantsColour: number
	Shoes: number
	ShoeColour: number
}

//const CharacterCustomItems = ReplicatedStorage.Assets.CharacterCustomItems
const itemFunctions = {
	Face: (item: string, itemNumber: number, colourBased: boolean) => {},
	Head: (item: string, itemNumber: number, colourBased: boolean) => {},
	Clothing: (item: string, itemNumber: number, colourBased: boolean) => {},
}

export = (actor: Model, data?: appearanceInterface) => {
	if (data !== undefined) {
		for (const [item, itemNumber] of pairs(data)) {
			if (item === "Eyes" || item === "Mouth") {
				itemFunctions.Face(item, itemNumber, typeIs(item.find("Colour"), "number"))
			} else if (item === "Shirt" || item === "Pants" || item === "Shoes") {
				itemFunctions.Clothing(item, itemNumber, typeIs(item.find("Colour"), "number"))
			} else if (item === "Hair") {
				itemFunctions.Head(item, itemNumber, typeIs(item.find("Colour"), "number"))
			}
		}
	}

	return actor
}
