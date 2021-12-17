import { KnitServer as Knit } from "@rbxts/knit"

const Services = script.WaitForChild("Services", 5) as Folder

Knit.AddServices(Services)
Knit.Start()
	.then(() => {
		print("Knit is running")
	})
	.catch(error)
