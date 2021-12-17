-- Compiled with roblox-ts v1.2.7
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- MODULES--
local FiniteStateMachine = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "FiniteStateMachine")
-- VARIABLES--
local AttackStates = {
	Idle = {
		Attack = "Attack",
		Block = "Block",
		Dodge = "Dodge",
	},
	Attack = {
		Idle = "Idle",
		Block = "Block",
		PerfectBlocked = "PerfectBlocked",
	},
	Block = {
		Attack = "Attack",
		Idle = "Idle",
	},
	Clash = {
		Stun = "Stun",
	},
	PerfectBlocked = {
		Stun = "Stun",
	},
	Dodge = {
		Idle = "Idle",
	},
	Stun = {
		Idle = "Idle",
	},
}
-- FUNCTIONS--
local AttackStateMachine = FiniteStateMachine.new("Idle", AttackStates)
AttackStateMachine.OnStateChanged:Connect(function(OldState, CurrentState)
	local _ = tostring(print("Attack State is " .. CurrentState)) .. "!"
end)
return AttackStateMachine
