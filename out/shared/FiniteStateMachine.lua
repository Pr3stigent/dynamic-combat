-- Compiled with roblox-ts v1.2.9
local FiniteStateMachine
do
	FiniteStateMachine = setmetatable({}, {
		__tostring = function()
			return "FiniteStateMachine"
		end,
	})
	FiniteStateMachine.__index = FiniteStateMachine
	function FiniteStateMachine.new(...)
		local self = setmetatable({}, FiniteStateMachine)
		return self:constructor(...) or self
	end
	function FiniteStateMachine:constructor(DefaultState, States)
		self.CurrentState = ""
		self.States = {}
		self.Signal = Instance.new("BindableEvent")
		self.OnStateChanged = self.Signal.Event
		self.CurrentState = DefaultState
		self.States = States
	end
	function FiniteStateMachine:SwitchState(state)
		local NewState = self.States[self.CurrentState]
		local _arg0 = self.States[self.CurrentState]
		if type(_arg0) == "table" then
			local bruh = NewState
			if (table.find(bruh, state) or 0) - 1 ~= nil then
				NewState = state
			end
		end
		if NewState ~= nil then
			self.Signal:Fire(self.CurrentState, NewState)
			self.CurrentState = state
		elseif state == self.CurrentState then
			return nil
		else
			warn("Can't go from " .. self.CurrentState .. " to " .. state)
		end
	end
	function FiniteStateMachine:Destroy()
		self.CurrentState = nil
		self.States = nil
		self.Signal = nil
	end
end
return FiniteStateMachine
--[[
	class FiniteStateMachine {
	public CurrentState = ""
	private States: { [key: string]: { [key: string]: string } } | undefined = {}
	private Signal = new Instance("BindableEvent")
	public OnStateChanged = this.Signal.Event
	constructor(DefaultState: string, States: {}) {
	this.CurrentState = DefaultState
	this.States = States
	}
	public SwitchState(State: string) {
	const NewState = this.States![this.CurrentState][State]
	if (NewState !== undefined) {
	this.Signal.Fire(this.CurrentState, NewState)
	this.CurrentState = NewState
	} else if (State === this.CurrentState) {
	return
	} else {
	warn("Can't go from " + this.CurrentState + " to " + State)
	}
	}
	public Destroy() {
	this.CurrentState = undefined!
	this.States = undefined!
	this.Signal = undefined!
	}
	}
	export = FiniteStateMachine
]]
