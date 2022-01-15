-- Compiled with roblox-ts v1.2.9
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit).KnitClient
Knit.AddControllersDeep(script:WaitForChild("Knit"):WaitForChild("Controllers"))
Knit.Start():andThen(function()
	print("Knit is running")
end):catch(error)
