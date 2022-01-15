import { Players, PathfindingService, RunService } from "@rbxts/services"

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
	MovementType: "Roaming" | "Stationary" | "Mixed"
	Paths: Vector3[] | Part[]
	NPCType: "Merchant" | "Trainer" | "Regular"
	AttackType: "Aggressive" | "Passive" | "Passive-Aggressive"
	QuestId: number
}


function getPath(origin, destination) {
	const path = PathfindingService.CreatePath()
	
	if (typeIs(destination, "Vector3")) {
		path.ComputeAsync(origin, destination)
	} else {
		path.ComputeAsync(origin, destination.Position)
	}

	return path
}

function walkToWaypoints(tableWaypoints) {
	for (const [i, v] of pairs(tableWaypoints)) {
		hum:MoveTo(v.Position)
		if (v.Action === Enum.PathWaypointAction.Jump) {
			hum.Jump = true
    }
		hum.MoveToFinished.Wait()
  }
}

function walkTo(destination) {
	const path = getPath(destination)
	if (path.Status === Enum.PathStatus.Success) {
		WalkToWaypoints(path.GetWaypoints())
	}
}

class NPC {
	private npc
	private npcData

	constructor(npcData: npcInterface) {
		this.npc = CharacterCustomisation(script.WaitForChild("NPC").Clone() as Model, npcData.Appearance)
		this.npcData = npcData

		const humanoid = this.npc.WaitForChild("Humanoid") as Humanoid

		this.Move(npcData.MovementType, npcData.Paths)

		let connection: RBXScriptConnection | undefined
		connection = humanoid.Died.Connect(() => {
			connection?.Disconnect()
			connection = undefined

			this.Die()
		})
	}

	public Move(movementType: "Roaming" | "Stationary" | "Mixed", path: Vector3[] | Part[]) {
		if (movementType === "Roaming") {
		  RunService.Heartbeat.Connect(() => walkTo(destination))
		} else if (movementType === "Mixed") {
		}
	}

	public Die() {}
}
