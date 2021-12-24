import { UserInputService } from "@rbxts/services"

import { KnitClient as Knit } from "@rbxts/knit"

declare global {
	interface KnitControllers {
		InputController: typeof InputController
	}
}

interface keyDownDataInterface {
	KeyType?: "Held" | "Timed" | "Pressed"
	KeyTime?: number
}

interface keyDownInterface extends keyDownDataInterface {
	Callback?: () => void
}

interface keyDownInterface2 extends keyDownInterface {
	ConsistOfKeys?: EnumItem[]
}

interface keyUpInterface {
	Callback?: () => void
	ConsistOfKeys?: EnumItem[]
}

function keysDown(keys: EnumItem[]) {
	let areKeysDown = false

	for (const key of keys) {
		if (key.EnumType === Enum.KeyCode) {
			if (UserInputService.IsKeyDown(key as Enum.KeyCode)) {
				areKeysDown = true
			} else {
				areKeysDown = false
				break
			}
		} else if (key.EnumType === Enum.UserInputType) {
			if (UserInputService.IsMouseButtonPressed(key as Enum.UserInputType)) {
				areKeysDown = true
			} else {
				areKeysDown = false
				break
			}
		}
	}

	return areKeysDown
}

const keyTypeActions = new Map<
	string,
	(
		data: { ConsistOfKeys?: EnumItem | EnumItem[]; KeyTime?: number; OsClock?: number },
		callback: () => void,
		key: EnumItem | EnumItem[],
		inputKey?: Enum.KeyCode | Enum.UserInputType,
	) => void
>()
keyTypeActions.set("Pressed", (data, callback, key, inputKey) => {
	task.spawn<EnumItem[]>(callback, inputKey as Enum.KeyCode | Enum.UserInputType)
})
keyTypeActions.set("Held", (data, callback, key, inputKey) => {
	task.spawn(() => {
		while (true) {
			if (typeIs(key, "table")) {
				if (keysDown(data.ConsistOfKeys as EnumItem[])) {
					task.spawn<EnumItem[]>(callback, inputKey as Enum.KeyCode | Enum.UserInputType)
				} else {
					break
				}
			} else if (typeIs(key, "EnumItem")) {
				if (UserInputService.IsKeyDown(key)) {
					task.spawn<EnumItem[]>(callback, inputKey as Enum.KeyCode | Enum.UserInputType)
				} else {
					break
				}
			}

			task.wait(data.KeyTime)
		}
	})
})
keyTypeActions.set("Timed", (data, callback, key, inputKey) => {
	let newTime = false

	if (data.OsClock !== undefined) {
		data.OsClock = os.clock()

		newTime = true
	}

	if (data.OsClock !== undefined && data.KeyTime !== undefined) {
		if (!newTime && os.clock() - data.OsClock <= data.KeyTime) {
			task.spawn<EnumItem[]>(callback, inputKey as Enum.KeyCode | Enum.UserInputType)
		}
	}

	data.OsClock = os.clock()
})

function sort(input: string) {
	const buffer: string[] = []

	for (let i = 1; i === input.size(); i++) {
		buffer[i] = string.sub(input, i, i)
	}

	buffer.sort()
	return buffer.join()
}

function enumItemsToStrings(enumItems: EnumItem[]) {
	const newString: string[] = []

	for (const enumItem of enumItems) {
		newString.insert(newString.size(), enumItem.Name)
	}

	return newString.join()
}

const InputController = Knit.CreateController({
	Name: "InputController",

	cache: {
		SingleKeysDown: new Map<Enum.KeyCode | Enum.UserInputType, [keyDownInterface]>(),
		DifferentKeysDown: new Map<string, [keyDownInterface2]>(),
		MultipleKeysDown: new Map<string, [keyDownInterface2]>(),

		SingleKeysUp: new Map<Enum.KeyCode | Enum.UserInputType, [() => void]>(),
		DifferentKeysUp: new Map<string, [keyUpInterface]>(),
		MultipleKeysUp: new Map<string, [keyUpInterface]>(),
	},

	states: {
		MultipleKeys: new Map<string, {}>(),
		DifferentKeys: new Map<string, { [key: string]: boolean }>(),
	},

	KeyDown(key: EnumItem | EnumItem[], callback: () => void, data?: keyDownDataInterface) {
		const keyType = data ? data.KeyType : "Pressed"
		const keyTime = data ? data.KeyTime : 0.2

		if (typeIs(key, "table")) {
			const keyName = sort(enumItemsToStrings(key as EnumItem[]))
			if (!this.cache.DifferentKeysDown.get(keyName)) {
				this.cache.DifferentKeysDown.set(keyName, [{}])
			}

			const cachedKey = this.cache.DifferentKeysDown.get(keyName)
			if (cachedKey !== undefined) {
				cachedKey.insert(cachedKey.size(), {
					KeyType: keyType,
					KeyTime: keyTime,
					Callback: callback,
					ConsistOfKeys: key as EnumItem[],
				})
			}
		} else if (typeIs(key, "EnumItem")) {
			if (!this.cache.SingleKeysDown.get(key)) {
				this.cache.SingleKeysDown.set(key, [{}])
			}

			const cachedKey = this.cache.SingleKeysDown.get(key)
			if (cachedKey !== undefined) {
				cachedKey.insert(cachedKey.size(), {
					KeyType: keyType,
					KeyTime: keyTime,
					Callback: callback,
				})
			}
		}
	},

	MultipleKeysDown(keys: EnumItem[], callback: () => void, data?: keyDownDataInterface) {
		const keyType = data ? data.KeyType : "Pressed"
		const keyTime = data ? data.KeyTime : 0.2

		const keyName = sort(enumItemsToStrings(keys))
		if (!this.cache.MultipleKeysDown.get(keyName)) {
			this.cache.MultipleKeysDown.set(keyName, [{}])
		}
		const cachedKey = this.cache.MultipleKeysDown.get(keyName)
		if (cachedKey !== undefined) {
			cachedKey.insert(cachedKey.size(), {
				KeyType: keyType,
				KeyTime: keyTime,
				Callback: callback,
				ConsistOfKeys: keys,
			})
		}
	},

	KeyUp(key: EnumItem | EnumItem[], callback: () => void) {
		if (typeIs(key, "table")) {
			const keyName = sort(enumItemsToStrings(key as EnumItem[]))
			if (!this.cache.DifferentKeysUp.get(keyName)) {
				this.cache.DifferentKeysUp.set(keyName, [{}])
			}

			const cachedKey = this.cache.DifferentKeysUp.get(keyName)
			if (cachedKey !== undefined) {
				cachedKey.insert(cachedKey?.size(), {
					Callback: callback,
					ConsistOfKeys: key as EnumItem[],
				})
			}
		} else if (typeIs(key, "EnumItem")) {
			if (!this.cache.SingleKeysUp.get(key)) {
				this.cache.SingleKeysUp.set(key, [() => {}])
			}

			const cachedKey = this.cache.SingleKeysUp.get(key)
			if (cachedKey !== undefined) {
				cachedKey.insert(cachedKey.size(), callback)
			}
		}
	},

	MultipleKeysUp(keys: EnumItem[], callback: () => void) {
		const keyName = sort(enumItemsToStrings(keys as EnumItem[]))
		if (!this.cache.MultipleKeysUp.get(keyName)) {
			this.cache.MultipleKeysUp.set(keyName, [{}])
		}

		const cachedKey = this.cache.MultipleKeysUp.get(keyName)
		if (cachedKey !== undefined) {
			cachedKey.insert(cachedKey?.size(), {
				Callback: callback,
				ConsistOfKeys: keys,
			})
		}
	},

	KnitStart() {
		UserInputService.InputBegan.Connect((input: InputObject, gameProccessedevent: boolean) => {
			if (gameProccessedevent) {
				return
			}

			for (const [key, data] of this.cache.MultipleKeysDown) {
				for (const data2 of data) {
					const keyType = data2.KeyType
					const callback = data2.Callback

					if (data2.ConsistOfKeys === undefined) {
						return
					}

					if (keysDown(data2.ConsistOfKeys)) {
						const keyAction = keyTypeActions.get(keyType as string)
						if (keyAction !== undefined) {
							keyAction(data2, callback as () => void, data2.ConsistOfKeys)
						}

						this.states.MultipleKeys.set(sort(enumItemsToStrings(data2.ConsistOfKeys)), true)
					}
				}
			}

			for (const [key, data] of this.cache.DifferentKeysDown) {
				for (const data2 of data) {
					const keyType = data2.KeyType
					const callback = data2.Callback

					const inputKey = input.KeyCode === Enum.KeyCode.Unknown ? input.UserInputType : input.KeyCode

					if (data2.ConsistOfKeys === undefined) {
						return
					}

					if (data2.ConsistOfKeys.indexOf(inputKey) !== undefined) {
						const keyAction = keyTypeActions.get(keyType as string)
						if (keyAction !== undefined) {
							keyAction(data2, callback as () => void, inputKey, inputKey)
						}

						if (
							this.states.DifferentKeys.get(sort(enumItemsToStrings(data2.ConsistOfKeys))) !== undefined
						) {
							this.states.DifferentKeys.set(sort(enumItemsToStrings(data2.ConsistOfKeys)), {})
						}

						const stateKey = this.states.DifferentKeys.get(sort(enumItemsToStrings(data2.ConsistOfKeys)))
						if (stateKey !== undefined) {
							stateKey[inputKey.Name] = true
						}
					}
				}
			}

			const inputKey = input.KeyCode === Enum.KeyCode.Unknown ? input.UserInputType : input.KeyCode
			const cacheKey = this.cache.SingleKeysDown.get(inputKey)
			if (cacheKey !== undefined) {
				for (const data of cacheKey) {
					const keyType = data.KeyType
					const callback = data.Callback

					const keyAction = keyTypeActions.get(keyType as string)
					if (keyAction !== undefined) {
						keyAction(data, callback as () => void, inputKey)
					}
				}
			}
		})

		UserInputService.InputEnded.Connect((input, gameProccessedevent) => {
			if (gameProccessedevent) {
				return
			}

			for (const [key, data] of this.cache.MultipleKeysUp) {
				for (const data2 of data) {
					const callback = data2.Callback

					if (data2.ConsistOfKeys === undefined) {
						return
					}

					const stateKey = this.states.MultipleKeys.get(sort(enumItemsToStrings(data2.ConsistOfKeys)))
					if (stateKey !== undefined) {
						const areKeysDown = keysDown(data2.ConsistOfKeys as EnumItem[])
						if (!areKeysDown) {
							task.spawn(callback as () => void)
						}

						this.states.MultipleKeys.set(sort(enumItemsToStrings(data2.ConsistOfKeys)), false)
					}
				}
			}

			for (const [key, data] of this.cache.DifferentKeysUp) {
				for (const data2 of data) {
					const callback = data2.Callback

					const inputKey = input.KeyCode === Enum.KeyCode.Unknown ? input.UserInputType : input.KeyCode

					if (data2.ConsistOfKeys === undefined) {
						return
					}

					const stateKey = this.states.DifferentKeys.get(sort(enumItemsToStrings(data2.ConsistOfKeys)))
					if (stateKey !== undefined && data2.ConsistOfKeys.indexOf(inputKey)) {
						const areKeysDown = keysDown(data2.ConsistOfKeys)
						if (!areKeysDown) {
							task.spawn<EnumItem[]>(callback as () => void, inputKey)
						}

						stateKey[inputKey.Name] = false
					}
				}
			}

			const inputKey = input.KeyCode === Enum.KeyCode.Unknown ? input.UserInputType : input.KeyCode
			const cacheKey = this.cache.SingleKeysUp.get(inputKey)
			if (cacheKey !== undefined) {
				for (const callback of cacheKey) {
					task.spawn(callback as () => void)
				}
			}
		})
	},
})

export = InputController
