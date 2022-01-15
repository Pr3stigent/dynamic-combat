import { Players, PathfindingService, RunService, Workspace } from "@rbxts/services"

import CharacterCustomisation from "./CharacterCustomisation"

interface npcInterface {
	Appearance?: {
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
	MovementType?: "Roaming" | "Stationary" | "Mixed"
	Paths?: Vector3[] | Part[]
	NPCType?: "Merchant" | "Trainer" | "Regular"
	AttackType?: "Aggressive" | "Passive" | "Passive-Aggressive"
	QuestId?: number
}

function getPath(origin: Vector3, destination: Vector3) {
	const path = PathfindingService.CreatePath()
	const [success, message] = pcall(() => {
		path.ComputeAsync(origin, destination)
	})

	return success ? path : undefined
}

function walkToWaypoints(humanoid: Humanoid, tableWaypoints: PathWaypoint[]) {
	for (const waypoint of tableWaypoints) {
		humanoid.MoveTo(waypoint.Position)
		if (waypoint.Action === Enum.PathWaypointAction.Jump) {
			humanoid.Jump = true
		}
		humanoid.MoveToFinished.Wait()
	}
}

function walkTo(humanoid: Humanoid, destination: Vector3) {
	const path = getPath(humanoid.RootPart?.Position as Vector3, destination)
	if (path !== undefined && path.Status === Enum.PathStatus.Success) {
		walkToWaypoints(humanoid, path.GetWaypoints())
	}
}

export = class NPC {
	private npc
	private humanoid
	private npcData

	constructor(npcData?: npcInterface) {
		print("here")
		if (npcData === undefined) return
		this.npc = CharacterCustomisation(script.WaitForChild("NPC").Clone() as Model, npcData.Appearance)
		print("here")
		if (this.npc === undefined) return
		this.humanoid = this.npc.WaitForChild("Humanoid") as Humanoid
		this.npcData = npcData
		print("here")
		this.npc.PivotTo(new CFrame())
		this.npc.Parent = Workspace
		print("here")
		if (npcData.MovementType === undefined && npcData.Paths === undefined) return
		this.Move(npcData.MovementType, npcData.Paths)
		print("here")
		let connection: RBXScriptConnection | undefined
		connection = this.humanoid.Died.Connect(() => {
			connection?.Disconnect()
			connection = undefined

			this.Die()
		})
	}

	public Move(movementType?: "Roaming" | "Stationary" | "Mixed", path?: Vector3[] | Part[]) {
		if (this.humanoid === undefined) return

		if (movementType === "Roaming") {
			RunService.Heartbeat.Connect(() => walkTo(this.humanoid as Humanoid, new Vector3(-1, 0.5, -264)))
		} else if (movementType === "Mixed") {
		}
	}

	public Die() {}
}
