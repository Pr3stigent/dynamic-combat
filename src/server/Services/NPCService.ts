import { KnitServer as Knit } from "@rbxts/knit"
import { Workspace } from "@rbxts/services"

import NPC from "../Modules/NPC"

declare global {
	interface KnitServices {
		NPCService: typeof NPCService
	}
}

const NPCService = Knit.CreateService({
	Name: "NPCService",

	Client: {},

	KnitInit() {},

	KnitStart() {
		task.wait(10)
		print("started")
		//const EF = Workspace.WaitForChild("Folder") as Folder
		const newNPC = new NPC({
			MovementType: "Roaming",
			//Paths: EF.GetChildren() as Part[],
		})
	},
})

export = NPCService
