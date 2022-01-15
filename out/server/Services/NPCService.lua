-- Compiled with roblox-ts v1.2.9
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit).KnitServer
local NPC = TS.import(script, game:GetService("ServerScriptService"), "TS", "Modules", "NPC")
local NPCService = Knit.CreateService({
	Name = "NPCService",
	Client = {},
	KnitInit = function(self) end,
	KnitStart = function(self)
		task.wait(10)
		print("started")
		-- const EF = Workspace.WaitForChild("Folder") as Folder
		local newNPC = NPC.new({
			MovementType = "Roaming",
		})
	end,
})
return NPCService
