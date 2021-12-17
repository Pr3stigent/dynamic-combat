-- Compiled with roblox-ts v1.2.7
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- |SERVICE|--
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local RunService = _services.RunService
-- |MODULES|--
local _knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit)
local Knit = _knit.KnitServer
local Signal = _knit.Signal
local RemoteSignal = _knit.RemoteSignal
-- |VARIABLES|--
-- |FUNCTIONS|--
local MovementService
MovementService = Knit.CreateService({
	Name = "MovementService",
	Stamina = {},
	MaxStamina = {},
	DrainAmount = {},
	DrainTick = {},
	DrainTime = {},
	Run = Signal.new(),
	Client = {
		Run = RemoteSignal.new(),
		StaminaChanged = RemoteSignal.new(),
	},
	KnitInit = function(self)
		Players.PlayerAdded:Connect(function(player)
			local _stamina = self.Stamina
			local _name = player.Name
			-- ▼ Map.set ▼
			_stamina[_name] = 100
			-- ▲ Map.set ▲
			local _maxStamina = self.MaxStamina
			local _name_1 = player.Name
			-- ▼ Map.set ▼
			_maxStamina[_name_1] = 100
			-- ▲ Map.set ▲
			local _drainAmount = self.DrainAmount
			local _name_2 = player.Name
			-- ▼ Map.set ▼
			_drainAmount[_name_2] = 1
			-- ▲ Map.set ▲
			local _drainTick = self.DrainTick
			local _name_3 = player.Name
			-- ▼ Map.set ▼
			_drainTick[_name_3] = 1
			-- ▲ Map.set ▲
			local _drainTime = self.DrainTime
			local _name_4 = player.Name
			local _arg1 = os.clock()
			-- ▼ Map.set ▼
			_drainTime[_name_4] = _arg1
			-- ▲ Map.set ▲
		end)
	end,
	KnitStart = function(self)
		self.Client.Run:Connect(function(...)
			local args = { ... }
			MovementService.Run:Fire(unpack(args))
		end)
		self.Run:Connect(function(player, action)
			local character = player.Character or (player.CharacterAdded:Wait())
			local humanoid = character:WaitForChild("Humanoid")
			local _drainAmount = self.DrainAmount
			local _name = player.Name
			local drainAmount = _drainAmount[_name]
			local _drainTick = self.DrainTick
			local _name_1 = player.Name
			local drainTick = _drainTick[_name_1]
			local _drainTime = self.DrainTime
			local _name_2 = player.Name
			local drainTime = _drainTime[_name_2]
			RunService.Heartbeat:Connect(function()
				if action == "Run" then
					if os.clock() - drainTime >= drainTick then
						local _stamina = self.Stamina
						local _name_3 = player.Name
						local currentStamina = _stamina[_name_3]
						local _stamina_1 = self.Stamina
						local _name_4 = player.Name
						local _arg1 = currentStamina - drainAmount
						-- ▼ Map.set ▼
						_stamina_1[_name_4] = _arg1
						-- ▲ Map.set ▲
						local _drainTime_1 = self.DrainTime
						local _name_5 = player.Name
						local _arg1_1 = os.clock()
						-- ▼ Map.set ▼
						_drainTime_1[_name_5] = _arg1_1
						-- ▲ Map.set ▲
					end
				end
			end)
			humanoid.WalkSpeed = action == "Run" and 20 or 9
		end)
	end,
})
return MovementService
