-- Compiled with roblox-ts v1.2.9
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
local Knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit).KnitClient
local FiniteStateMachine = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "FiniteStateMachine")
local player = Players.LocalPlayer
local character = player.Character or (player.CharacterAdded:Wait())
local humanoid = character:WaitForChild("Humanoid")
local humanoidRootPart = character:WaitForChild("HumanoidRootPart")
local animator = humanoid:WaitForChild("Animator")
local runningAnimation = Instance.new("Animation")
runningAnimation.AnimationId = "rbxassetid://6902123055"
local runningTrack = animator:LoadAnimation(runningAnimation)
local leftDashAnimation = Instance.new("Animation")
leftDashAnimation.AnimationId = "rbxassetid://6933763433"
local leftDashTrack = animator:LoadAnimation(leftDashAnimation)
local rightDashAnimation = Instance.new("Animation")
rightDashAnimation.AnimationId = "rbxassetid://6933767229"
local rightDashTrack = animator:LoadAnimation(rightDashAnimation)
local states = {
	Idle = { "Walk", "Run", "Jump", "Dash", "InAir" },
	Jump = { "Walk", "Dash", "InAir" },
	InAir = { "Walk", "Run", "Idle", "Dash" },
	Walk = { "Idle", "Run", "Jump", "InAir" },
	Run = { "Walk", "Idle", "Jump", "InAir" },
	Dash = { "Idle", "Jump", "InAir", "Walk", "Run" },
	Block = { "Walk", "Idle", "Jump", "InAir" },
}
local humanoidFloorStates = {
	OnGround = "InAir",
	InAir = "OnGround",
}
local MovementService = Knit.GetService("MovementService")
local function stateConditions(States)
	local bool = true
	for _, state in ipairs(States) do
		if humanoid:GetState() == state then
			bool = false
			break
		end
	end
	return bool
end
local CharacterController = Knit.CreateController({
	Name = "CharacterController",
	LastJumped = os.clock(),
	FootDashed = false,
	MovementStateMachine = FiniteStateMachine.new("Idle", states),
	StateMachine = FiniteStateMachine.new("OnGround", humanoidFloorStates),
	Sprint = function(self, toggle)
		if toggle then
			local states = { Enum.HumanoidStateType.Climbing, Enum.HumanoidStateType.Swimming, Enum.HumanoidStateType.Freefall, Enum.HumanoidStateType.Jumping }
			if stateConditions(states) then
				if humanoid.MoveDirection.Magnitude > 0 then
					MovementService.Run:Fire("Run")
					runningTrack:Play(nil, nil, 1.2)
					self.MovementStateMachine:SwitchState("Run")
				end
			else
				MovementService.Run:Fire("StopRun")
			end
			runningTrack:Stop()
			self.MovementStateMachine:SwitchState("Idle")
		end
	end,
	KnitStart = function(self)
		humanoid.Running:Connect(function(speed)
			if speed >= 1 and speed <= 9 then
				runningTrack:Stop()
				self.MovementStateMachine:SwitchState("Walk")
			elseif speed >= 10 and speed <= 20 then
				if not runningTrack.IsPlaying then
					runningTrack:Play(nil, nil, 1.2)
				end
				self.MovementStateMachine:SwitchState("Run")
			elseif speed < 0.5 then
				self:Sprint(false)
				self.MovementStateMachine:SwitchState("Idle")
			end
		end)
		humanoid.StateChanged:Connect(function(oldState, newState)
			if newState == Enum.HumanoidStateType.Jumping then
				if os.clock() - self.LastJumped >= 2 then
					self.LastJumped = os.clock()
					runningTrack:Stop()
					self.MovementStateMachine:SwitchState("Jump")
					humanoid:SetStateEnabled(Enum.HumanoidStateType.Jumping, false)
					wait(1.95)
					humanoid:SetStateEnabled(Enum.HumanoidStateType.Jumping, true)
				end
			elseif newState == Enum.HumanoidStateType.Landed then
				local velocity = humanoidRootPart:GetVelocityAtPosition(humanoidRootPart.Position)
				local speed = Vector3.new(velocity.X, 0, velocity.Z).Magnitude
				self.MovementStateMachine:SwitchState((speed >= 1 and (if humanoid.WalkSpeed == 9 then "Walk" else (humanoid.WalkSpeed == 20 and "Run") or "Walk")) or "Idle")
				if self.MovementStateMachine.CurrentState == "Run" then
					if not runningTrack.IsPlaying then
						runningTrack:Play(nil, nil, 1.2)
					end
				end
			elseif newState == Enum.HumanoidStateType.Climbing or newState == Enum.HumanoidStateType.Freefall then
				if newState == Enum.HumanoidStateType.Freefall then
					self.MovementStateMachine:SwitchState("InAir")
				end
				runningTrack:Stop()
			end
		end)
		humanoid:GetPropertyChangedSignal("FloorMaterial"):Connect(function()
			if humanoid.FloorMaterial == Enum.Material.Air then
				self.StateMachine:SwitchState("InAir")
			else
				self.StateMachine:SwitchState("OnGround")
			end
		end)
	end,
})
return CharacterController
