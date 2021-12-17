import { KnitClient as Knit } from "@rbxts/knit"

declare global {
	interface KnitControllers {
		ComboController: typeof ComboController
	}
}

let InputController = Knit.GetController("InputController")
let CharacterController = Knit.GetController("CharacterController")

const ComboController = Knit.CreateController({
	Name: "ComboController",
	Combo: "",

	Start() {
		let key = ""
		if (CharacterController.StateMachine.CurrentState === "InAir") {
			key = "A"
		} else if (CharacterController.StateMachine.CurrentState === "OnGround") {
			key = "G"
		}
		this.Combo += "L" + key
	},

	KnitStart() {
		InputController = Knit.GetController("InputController")
		CharacterController = Knit.GetController("CharacterController")
		InputController.KeyDown(Enum.UserInputType.MouseButton1, () => this.Start())
	},
})

export = ComboController
