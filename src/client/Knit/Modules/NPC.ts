import { Players } from "@rbxts/services"

import CharacterCustomisation from "./CharacterCustomisation"

interface npcInterface {
	Appearance: {
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
	Type: "Roaming" | "Stationary" | "Mixed"
}

class NPC {
	private npc
	private npcData

	constructor(npcData: npcInterface) {
		this.npc = CharacterCustomisation(script.WaitForChild("NPC").Clone() as Model, npcData.Appearance)
		this.npcData = npcData

		const humanoid = this.npc.WaitForChild("Humanoid") as Humanoid

		this.Move(npcData.Type)

		let connection: RBXScriptConnection | undefined
		connection = humanoid.Died.Connect(() => {
			connection?.Disconnect()
			connection = undefined

			this.Die()
		})
	}

	public Move(type: "Roaming" | "Stationary" | "Mixed") {
		if (type === "Roaming") {
		} else if (type === "Mixed") {
		}
	}

	public Die() {}
}
