-- Compiled with roblox-ts v1.2.7
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit).KnitClient
local InputController = Knit.GetController("InputController")
local CharacterController = Knit.GetController("CharacterController")
local ComboController = Knit.CreateController({
	Name = "ComboController",
	Combo = "",
	Start = function(self)
		local key = ""
		if CharacterController.StateMachine.CurrentState == "InAir" then
			key = "A"
		elseif CharacterController.StateMachine.CurrentState == "OnGround" then
			key = "G"
		end
		self.Combo ..= "L" .. key
		print(self.Combo)
	end,
	KnitStart = function(self)
		InputController = Knit.GetController("InputController")
		CharacterController = Knit.GetController("CharacterController")
		InputController:KeyDown(Enum.UserInputType.MouseButton1, function()
			return self:Start()
		end)
	end,
})
return ComboController
