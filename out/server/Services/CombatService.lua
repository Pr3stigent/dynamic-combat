-- Compiled with roblox-ts v1.2.7
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- |SERVICES|--
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
-- |MODULES|--
local _knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit)
local Knit = _knit.KnitServer
local Signal = _knit.Signal
local RemoteSignal = _knit.RemoteSignal
local FiniteStateMachine = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "FiniteStateMachine")
local SharedWeapons = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "SharedCombat", "Weapons")
-- |VARIABLES|--
local States = {
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
-- |FUNCTIONS|--
local CombatService
CombatService = Knit.CreateService({
	Name = "CombatService",
	Weapon = {},
	Combo = {},
	ComboChanged = {},
	Attack = Signal.new(),
	AttackStateMachine = {},
	Client = {
		ComboChanged = RemoteSignal.new(),
		Attack = RemoteSignal.new(),
		AttackStateMachine = RemoteSignal.new(),
		GetCombo = function(self, Player)
			local Combo = self:GetCombo(Player)
			return Combo
		end,
	},
	UpdateCombo = function(self, Player, Input)
		local _combo = self.Combo
		local _name = Player.Name
		local Combo = _combo[_name]
		if Combo ~= nil then
			local _combo_1 = self.Combo
			local _name_1 = Player.Name
			local _arg1 = Combo .. Input[2]
			-- ▼ Map.set ▼
			_combo_1[_name_1] = _arg1
			-- ▲ Map.set ▲
		end
		local _comboChanged = self.ComboChanged
		local _name_1 = Player.Name
		local ComboChanged = _comboChanged[_name_1]
		if ComboChanged ~= nil then
			ComboChanged:Fire(self:GetCombo(Player))
			self.Client.ComboChanged:Fire(Player, self:GetCombo(Player))
		end
	end,
	GetCombo = function(self, Player)
		local _combo = self.Combo
		local _name = Player.Name
		return _combo[_name]
	end,
	KnitInit = function(self)
		Players.PlayerAdded:Connect(function(Player)
			local _attackStateMachine = self.AttackStateMachine
			local _name = Player.Name
			local _arg1 = { FiniteStateMachine.new("Idle", States), Signal.new() }
			-- ▼ Map.set ▼
			_attackStateMachine[_name] = _arg1
			-- ▲ Map.set ▲
			local _attackStateMachine_1 = self.AttackStateMachine
			local _name_1 = Player.Name
			local AttackStateMachine = _attackStateMachine_1[_name_1]
			if AttackStateMachine then
				AttackStateMachine[1].OnStateChanged:Connect(function(OldState, NewState)
					CombatService.Client.AttackStateMachine:Fire(Player, OldState, NewState)
				end)
			end
			local _combo = self.Combo
			local _name_2 = Player.Name
			-- ▼ Map.set ▼
			_combo[_name_2] = ""
			-- ▲ Map.set ▲
			local _comboChanged = self.ComboChanged
			local _name_3 = Player.Name
			local _signal = Signal.new()
			-- ▼ Map.set ▼
			_comboChanged[_name_3] = _signal
			-- ▲ Map.set ▲
			local _weapon = self.Weapon
			local _name_4 = Player.Name
			-- ▼ Map.set ▼
			_weapon[_name_4] = "Fist"
			-- ▲ Map.set ▲
		end)
	end,
	KnitStart = function(self)
		self.Client.Attack:Connect(function(...)
			local args = { ... }
			self.Attack:Fire(unpack(args))
		end)
		self.Client.AttackStateMachine:Connect(function(Player, OldState, CurrentState)
			print("Attack State is " .. CurrentState .. "!")
			self.Client.AttackStateMachine:Fire(Player, OldState, CurrentState)
		end)
		self.Attack:Connect(function(Player, Input, HeldTime, MovementState)
			local c = os.clock()
			if Input[1] == "Block" then
				-- Blocks
				print("Block")
			else
				local _attackStateMachine = self.AttackStateMachine
				local _name = Player.Name
				local AttackStateMachine = _attackStateMachine[_name]
				if not AttackStateMachine then
					return nil
				end
				if AttackStateMachine[1].CurrentState ~= "Block" then
					local CurrentCombo = tostring(self:GetCombo(Player)) .. Input[2]
					local _exp = SharedWeapons
					local _weapon = self.Weapon
					local _name_1 = Player.Name
					local Combos = _exp[_weapon[_name_1]].Combos
					local ComboData = Combos[CurrentCombo]
					if ComboData ~= nil then
						if type(ComboData) == "string" then
							return nil
						end
						-- Does an attack
						AttackStateMachine[1]:SwitchState("Attack")
						self:UpdateCombo(Player, Input)
						print((self:GetCombo(Player)), AttackStateMachine[1].CurrentState)
					end
				end
			end
			print(os.clock() - c)
		end)
	end,
})
return CombatService
