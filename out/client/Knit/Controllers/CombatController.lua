-- Compiled with roblox-ts v1.2.9
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
local Knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit).KnitClient
local player = Players.LocalPlayer
local character = player.Character or (player.CharacterAdded:Wait())
local state = character:WaitForChild("State")
local InputController = Knit.GetController("InputController")
local CharacterController = Knit.GetController("CharacterController")
local ComboController = Knit.CreateController({
	Name = "ComboController",
	Combo = "",
	Attack = function(self)
		local key = ""
		if CharacterController.StateMachine.CurrentState == "InAir" then
			key = "A"
		elseif CharacterController.StateMachine.CurrentState == "OnGround" then
			key = "G"
		end
		self.Combo ..= "L" .. key
	end,
	Block = function(self, toggle)
		if toggle then
			local _value = state:GetAttribute("Blocking")
			if not (_value ~= 0 and (_value == _value and (_value ~= "" and _value))) then
				state:SetAttribute("Blocking", true)
			end
		else
			local _value = state:GetAttribute("Blocking")
			if _value ~= 0 and (_value == _value and (_value ~= "" and _value)) then
				state:SetAttribute("Blocking", false)
			end
		end
	end,
	KnitStart = function(self)
		InputController = Knit.GetController("InputController")
		CharacterController = Knit.GetController("CharacterController")
		InputController:KeyDown(Enum.UserInputType.MouseButton1, function()
			return self:Attack()
		end)
		InputController:KeyDown(Enum.KeyCode.F, function()
			return self:Block(true)
		end, {
			KeyType = "Held",
		})
		InputController:KeyUp(Enum.KeyCode.F, function()
			return self:Block(false)
		end)
	end,
})
return ComboController
