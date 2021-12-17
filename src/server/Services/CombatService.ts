//|SERVICES|--
import { Players } from "@rbxts/services"

//|MODULES|--
import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit"
import FiniteStateMachine from "shared/FiniteStateMachine"

import ServerWeapons from "server/Weapons"
import SharedWeapons from "shared/SharedCombat/Weapons"

//|VARIABLES|--
const States = {
	Idle: {
		["Attack"]: "Attack",
		["Block"]: "Block",
		["Dodge"]: "Dodge",
	},
	Attack: {
		["Idle"]: "Idle",
		["Block"]: "Block",
		["PerfectBlocked"]: "PerfectBlocked",
	},
	Block: {
		["Attack"]: "Attack",
		["Idle"]: "Idle",
	},
	Clash: {
		["Stun"]: "Stun",
	},
	PerfectBlocked: {
		["Stun"]: "Stun",
	},
	Dodge: {
		["Idle"]: "Idle",
	},
	Stun: {
		["Idle"]: "Idle",
	},
}

//|FUNCTIONS|--
declare global {
	interface KnitServices {
		CombatService: typeof CombatService
	}
}

const CombatService = Knit.CreateService({
	Name: "CombatService",

	Weapon: new Map<string, string>(),
	Combo: new Map<string, string>(),
	ComboChanged: new Map<string, Signal>(),
	Attack: new Signal(),

	AttackStateMachine: new Map<string, [FiniteStateMachine, Signal]>(),

	Client: {
		ComboChanged: new RemoteSignal(),

		Attack: new RemoteSignal(),
		AttackStateMachine: new RemoteSignal(),

		GetCombo(Player: Player) {
			const Combo = this.GetCombo(Player) as string
			return Combo
		},
	},

	UpdateCombo(Player: Player, Input: [Name: string, Combo: string]) {
		const Combo = this.Combo.get(Player.Name)
		if (Combo !== undefined) {
			this.Combo.set(Player.Name, Combo + Input[1])
		}

		const ComboChanged = this.ComboChanged.get(Player.Name)
		if (ComboChanged !== undefined) {
			ComboChanged.Fire(this.GetCombo(Player))
			this.Client.ComboChanged.Fire(Player, this.GetCombo(Player))
		}
	},

	GetCombo(Player: Player) {
		return this.Combo.get(Player.Name)
	},

	KnitInit() {
		Players.PlayerAdded.Connect((Player: Player) => {
			this.AttackStateMachine.set(Player.Name, [new FiniteStateMachine("Idle", States), new Signal()])

			const AttackStateMachine = this.AttackStateMachine.get(Player.Name)
			if (AttackStateMachine) {
				AttackStateMachine[0].OnStateChanged.Connect((OldState: string, NewState: string) => {
					CombatService.Client.AttackStateMachine.Fire(Player, OldState, NewState)
				})
			}

			this.Combo.set(Player.Name, "")
			this.ComboChanged.set(Player.Name, new Signal())
			this.Weapon.set(Player.Name, "Fist")
		})
	},

	KnitStart() {
		this.Client.Attack.Connect((...args: unknown[]) => {
			this.Attack.Fire(...args)
		})

		this.Client.AttackStateMachine.Connect((Player: Player, OldState: string, CurrentState: string) => {
			print("Attack State is " + CurrentState + "!")
			this.Client.AttackStateMachine.Fire(Player, OldState, CurrentState)
		})

		this.Attack.Connect(
			(Player: Player, Input: [Name: string, Combo: string], HeldTime: number, MovementState: string) => {
				const c = os.clock()
				if (Input[0] === "Block") {
					//Blocks
					print("Block")
				} else {
					const AttackStateMachine = this.AttackStateMachine.get(Player.Name)
					if (!AttackStateMachine) {
						return
					}

					if (AttackStateMachine[0].CurrentState !== "Block") {
						const CurrentCombo = this.GetCombo(Player) + Input[1]
						const Combos = SharedWeapons[this.Weapon.get(Player.Name) as keyof typeof SharedWeapons].Combos
						const ComboData = Combos[CurrentCombo as keyof typeof Combos]

						if (ComboData !== undefined) {
							if (typeIs(ComboData, "string")) {
								return
							}

							//Does an attack
							AttackStateMachine[0].SwitchState("Attack")

							this.UpdateCombo(Player, Input)
							print(this.GetCombo(Player), AttackStateMachine[0].CurrentState)
						}
					}
				}
				print(os.clock() - c)
			},
		)
	},
})

export = CombatService
