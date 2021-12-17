import { Players } from "@rbxts/services"

import { KnitClient as Knit } from "@rbxts/knit"
import FiniteStateMachine from "shared/FiniteStateMachine"

const player = Players.LocalPlayer
const character = player.Character || player.CharacterAdded.Wait()[0]
const humanoid = character.WaitForChild("Humanoid") as Humanoid
const humanoidRootPart = character.WaitForChild("HumanoidRootPart") as BasePart
const animator = humanoid.WaitForChild("Animator") as Animator

const runningAnimation = new Instance("Animation")
runningAnimation.AnimationId = "rbxassetid://6902123055"
const runningTrack = animator.LoadAnimation(runningAnimation)

const leftDashAnimation = new Instance("Animation")
leftDashAnimation.AnimationId = "rbxassetid://6933763433"
const leftDashTrack = animator.LoadAnimation(leftDashAnimation)

const rightDashAnimation = new Instance("Animation")
rightDashAnimation.AnimationId = "rbxassetid://6933767229"
const rightDashTrack = animator.LoadAnimation(rightDashAnimation)

const states = {
	Idle: ["Walk", "Run", "Jump", "Dash", "InAir"],
	Jump: ["Walk", "Dash", "InAir"],
	InAir: ["Walk", "Run", "Idle", "Dash"],
	Walk: ["Idle", "Run", "Jump", "InAir"],
	Run: ["Walk", "Idle", "Jump", "InAir"],
	Dash: ["Idle", "Jump", "InAir", "Walk", "Run"],
	Block: ["Walk", "Idle", "Jump", "InAir"],
}

const humanoidFloorStates = {
	OnGround: "InAir",
	InAir: "OnGround",
}

const MovementService = Knit.GetService("MovementService")

declare global {
	interface KnitControllers {
		CharacterController: typeof CharacterController
	}
}

function stateConditions(States: Enum.HumanoidStateType[]) {
	let bool = true

	for (const state of States) {
		if (humanoid.GetState() === state) {
			bool = false
			break
		}
	}

	return bool
}

const CharacterController = Knit.CreateController({
	Name: "CharacterController",

	LastJumped: os.clock(),
	FootDashed: false,

	MovementStateMachine: new FiniteStateMachine("Idle", states),
	StateMachine: new FiniteStateMachine("OnGround", humanoidFloorStates),

	Sprint(toggle: boolean) {
		if (toggle) {
			const states = [
				Enum.HumanoidStateType.Climbing,
				Enum.HumanoidStateType.Swimming,
				Enum.HumanoidStateType.Freefall,
				Enum.HumanoidStateType.Jumping,
			]

			if (stateConditions(states)) {
				if (humanoid.MoveDirection.Magnitude > 0) {
					MovementService.Run.Fire("Run")
					runningTrack.Play(undefined, undefined, 1.2)
					this.MovementStateMachine.SwitchState("Run")
				}
			} else MovementService.Run.Fire("StopRun")
			runningTrack.Stop()
			this.MovementStateMachine.SwitchState("Idle")
		}
	},

	KnitStart() {
		humanoid.Running.Connect((speed: number) => {
			if (speed >= 1 && speed <= 9) {
				runningTrack.Stop()
				this.MovementStateMachine.SwitchState("Walk")
			} else if (speed >= 10 && speed <= 20) {
				if (!runningTrack.IsPlaying) {
					runningTrack.Play(undefined, undefined, 1.2)
				}

				this.MovementStateMachine.SwitchState("Run")
			} else if (speed < 0.5) {
				this.Sprint(false)
				this.MovementStateMachine.SwitchState("Idle")
			}
		})

		humanoid.StateChanged.Connect((oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) => {
			if (newState === Enum.HumanoidStateType.Jumping) {
				if (os.clock() - this.LastJumped >= 2) {
					this.LastJumped = os.clock()

					runningTrack.Stop()
					this.MovementStateMachine.SwitchState("Jump")

					humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, false)

					wait(1.95)

					humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, true)
				}
			} else if (newState === Enum.HumanoidStateType.Landed) {
				const velocity = humanoidRootPart.GetVelocityAtPosition(humanoidRootPart.Position)
				const speed = new Vector3(velocity.X, 0, velocity.Z).Magnitude

				this.MovementStateMachine.SwitchState(
					(speed >= 1 &&
						(humanoid.WalkSpeed === 9 ? "Walk" : (humanoid.WalkSpeed === 20 && "Run") || "Walk")) ||
						"Idle",
				)

				if (this.MovementStateMachine.CurrentState === "Run") {
					if (!runningTrack.IsPlaying) {
						runningTrack.Play(undefined, undefined, 1.2)
					}
				}
			} else if (newState === Enum.HumanoidStateType.Climbing || newState === Enum.HumanoidStateType.Freefall) {
				if (newState === Enum.HumanoidStateType.Freefall) {
					this.MovementStateMachine.SwitchState("InAir")
				}

				runningTrack.Stop()
			}
		})

		humanoid.GetPropertyChangedSignal("FloorMaterial").Connect(() => {
			if (humanoid.FloorMaterial === Enum.Material.Air) {
				this.StateMachine.SwitchState("InAir")
			} else {
				this.StateMachine.SwitchState("OnGround")
			}
		})
	},
})

export = CharacterController
