import { Players } from "@rbxts/services"

import { KnitClient as Knit } from "@rbxts/knit"

import Debounce from "shared/Debounce"

declare global {
	interface KnitControllers {
		ComboController: typeof ComboController
	}
}

const player = Players.LocalPlayer
const character = player.Character || player.CharacterAdded.Wait()[0] as Model
const state = character.WaitForChild("State") as Configuration

let InputController = Knit.GetController("InputController")
let CharacterController = Knit.GetController("CharacterController")

const ComboController = Knit.CreateController({
	Name: "ComboController",
	Combo: "",

	Attack() {
		let key = ""
		if (CharacterController.StateMachine.CurrentState === "InAir") {
			key = "A"
		} else if (CharacterController.StateMachine.CurrentState === "OnGround") {
			key = "G"
		}
		this.Combo += "L" + key
	},

	Block(toggle: boolean) {
	  if (toggle) {
	    if (!state.GetAttribute("Blocking")) {
	      state.SetAttribute("Blocking", true)
	    }
	  } else {
	    if (state.GetAttribute("Blocking")) {
	      state.SetAttribute("Blocking", false)
	    }
	  }
	},

	KnitStart() {
		InputController = Knit.GetController("InputController")
		CharacterController = Knit.GetController("CharacterController")

		InputController.KeyDown(Enum.UserInputType.MouseButton1, () => this.Attack())
		InputController.KeyDown(Enum.KeyCode.F, () => this.Block(true), { KeyType: "Held" })
		InputController.KeyUp(Enum.KeyCode.F, () => this.Block(false))
	},
})

export = ComboController
