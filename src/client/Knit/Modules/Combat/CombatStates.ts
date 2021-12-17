//MODULES--
import FiniteStateMachine from "shared/FiniteStateMachine";

//VARIABLES--
const AttackStates = {
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
};

//FUNCTIONS--
const AttackStateMachine = new FiniteStateMachine("Idle", AttackStates);
AttackStateMachine.OnStateChanged.Connect((OldState: string, CurrentState: string) => {
	print("Attack State is " + CurrentState) + "!";
});

export = AttackStateMachine;
