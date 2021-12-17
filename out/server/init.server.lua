-- Compiled with roblox-ts v1.2.7
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit).KnitServer
local Services = script:WaitForChild("Services", 5)
Knit.AddServices(Services)
local _exp = Knit.Start()
local _arg0 = function()
	print("Knit is running")
end
_exp:andThen(_arg0):catch(error)
