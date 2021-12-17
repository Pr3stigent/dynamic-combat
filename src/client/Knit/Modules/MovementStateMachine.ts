import FiniteStateMachine from "shared/FiniteStateMachine"

const States = {
	Idle: {
		["Walk"]: "Walk",
		["Run"]: "Run",
		["Jump"]: "Jump",
		["Dash"]: "Dash",
		["InAir"]: "InAir",
	},
	Jump: {
		["Walk"]: "Walk",
		["Dash"]: "Dash",
		["InAir"]: "InAir",
	},
	InAir: {
		["Walk"]: "Walk",
		["Run"]: "Run",
		["Idle"]: "Idle",
		["Dash"]: "Dash",
	},
	Walk: {
		["Idle"]: "Idle",
		["Run"]: "Run",
		["Jump"]: "Jump",
		["InAir"]: "InAir",
	},
	Run: {
		["Walk"]: "Walk",
		["Idle"]: "Idle",
		["Jump"]: "Jump",
		["InAir"]: "InAir",
	},
	Dash: {
		["Idle"]: "Idle",
		["Jump"]: "Jump",
		["InAir"]: "InAir",
		["Walk"]: "Walk",
		["Run"]: "Run",
	},
	Block: {
		["Walk"]: "Walk",
		["Idle"]: "Idle",
		["Jump"]: "Jump",
		["InAir"]: "InAir",
	},
}

export = new FiniteStateMachine("Idle", States)
