class FiniteStateMachine {
	public CurrentState = ""
	private States: { [key: string]: string | string[] } | undefined = {}
	private Signal = new Instance("BindableEvent")
	public OnStateChanged = this.Signal.Event

	public constructor(DefaultState: string, States: {}) {
		this.CurrentState = DefaultState
		this.States = States
	}

	public SwitchState(state: string) {
		let NewState = this.States![this.CurrentState]
		if (typeIs(this.States![this.CurrentState], "table")) {
			const bruh = NewState as string[]
			if (bruh.indexOf(state) !== undefined) {
				NewState = state
			}
		}

		if (NewState !== undefined) {
			this.Signal.Fire(this.CurrentState, NewState)
			this.CurrentState = state
		} else if (state === this.CurrentState) {
			return
		} else {
			warn("Can't go from " + this.CurrentState + " to " + state)
		}
	}

	public Destroy() {
		this.CurrentState = undefined!
		this.States = undefined!
		this.Signal = undefined!
	}
}

export = FiniteStateMachine

/*
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

*/
