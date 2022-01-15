-- Compiled with roblox-ts v1.2.9
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local PathfindingService = _services.PathfindingService
local RunService = _services.RunService
local CharacterCustomisation = TS.import(script, script.Parent, "CharacterCustomisation")
local function getPath(origin, destination)
	local path = PathfindingService:CreatePath()
	local success, message = pcall(function()
		path:ComputeAsync(origin, destination)
	end)
	return if success then path else nil
end
local function walkToWaypoints(humanoid, tableWaypoints)
	for _, waypoint in ipairs(tableWaypoints) do
		humanoid:MoveTo(waypoint.Position)
		if waypoint.Action == Enum.PathWaypointAction.Jump then
			humanoid.Jump = true
		end
		humanoid.MoveToFinished:Wait()
	end
end
local function walkTo(humanoid, destination)
	local _result = humanoid.RootPart
	if _result ~= nil then
		_result = _result.Position
	end
	local path = getPath(_result, destination)
	if path ~= nil and path.Status == Enum.PathStatus.Success then
		walkToWaypoints(humanoid, path:GetWaypoints())
	end
end
local NPC
do
	NPC = setmetatable({}, {
		__tostring = function()
			return "NPC"
		end,
	})
	NPC.__index = NPC
	function NPC.new(...)
		local self = setmetatable({}, NPC)
		return self:constructor(...) or self
	end
	function NPC:constructor(npcData)
		self.npc = CharacterCustomisation(script:WaitForChild("NPC"):Clone(), npcData.Appearance)
		self.humanoid = self.npc:WaitForChild("Humanoid")
		self.npcData = npcData
		self:Move(npcData.MovementType, npcData.Paths)
		local connection
		connection = self.humanoid.Died:Connect(function()
			local _result = connection
			if _result ~= nil then
				_result:Disconnect()
			end
			connection = nil
			self:Die()
		end)
	end
	function NPC:Move(movementType, path)
		if movementType == "Roaming" then
			RunService.Heartbeat:Connect(function()
				return walkTo(self.humanoid, Vector3.new())
			end)
		elseif movementType == "Mixed" then
		end
	end
	function NPC:Die()
	end
end
return nil
