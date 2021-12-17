//|SERVICE|--
import { Players, RunService } from "@rbxts/services";

//|MODULES|--
import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";

//|VARIABLES|--
declare global {
	interface KnitServices {
		MovementService: typeof MovementService;
	}
}

//|FUNCTIONS|--
const MovementService = Knit.CreateService({
	Name: "MovementService",

	Stamina: new Map<string, number>(),
	MaxStamina: new Map<string, number>(),
	DrainAmount: new Map<string, number>(),
	DrainTick: new Map<string, number>(),
	DrainTime: new Map<string, number>(),

	Run: new Signal(),

	Client: {
		Run: new RemoteSignal(),
		StaminaChanged: new RemoteSignal(),
	},

	KnitInit() {
		Players.PlayerAdded.Connect((player: Player) => {
			this.Stamina.set(player.Name, 100);
			this.MaxStamina.set(player.Name, 100);

			this.DrainAmount.set(player.Name, 1);
			this.DrainTick.set(player.Name, 1);
			this.DrainTime.set(player.Name, os.clock());
		});
	},

	KnitStart() {
		this.Client.Run.Connect((...args: unknown[]) => {
			MovementService.Run.Fire(...args);
		});

		this.Run.Connect((player: Player, action: string) => {
			const character = player.Character || player.CharacterAdded.Wait()[0];
			const humanoid = character.WaitForChild("Humanoid") as Humanoid;

			const drainAmount = this.DrainAmount.get(player.Name) as number;
			const drainTick = this.DrainTick.get(player.Name) as number;
			const drainTime = this.DrainTime.get(player.Name) as number;

			RunService.Heartbeat.Connect(() => {
				if (action === "Run") {
					if (os.clock() - drainTime >= drainTick) {
						const currentStamina = this.Stamina.get(player.Name) as number;

						this.Stamina.set(player.Name, currentStamina - drainAmount);
						this.DrainTime.set(player.Name, os.clock());
					}
				}
			});

			humanoid.WalkSpeed = action === "Run" ? 20 : 9;
		});
	},
});

export = MovementService;
