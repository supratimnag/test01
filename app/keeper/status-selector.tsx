"use client";

import * as React from "react";
import {
	Check,
	ChevronsUpDown,
	CircleCheck,
	Clock,
	ClockAlert,
	Timer,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

// statuses- "pending" | "completed" | "incomplete" | "in-progress"

const frameworks = [
	{
		value: "pending",
		label: "Pending",
		icon: Clock,
	},
	{
		value: "completed",
		label: "Completed",
		icon: CircleCheck,
	},
	{
		value: "incomplete",
		label: "Incomplete",
		icon: ClockAlert,
	},
	{
		value: "in-progress",
		label: "In Progress",
		icon: Timer,
	},
];

export function StatusSelector({
	value,
	setValue,
}: {
	value: string;
	setValue: (value: string) => void;
}) {
	const [open, setOpen] = React.useState(false);
	const foundFramework = React.useMemo(() => {
		if (value) {
			return frameworks.find((framework) => framework.value === value);
		}
		return null;
	}, [value]);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value ? (
						<div className="flex items-center gap-2">
							{foundFramework?.icon && (
								<foundFramework.icon className="h-4 w-4" />
							)}
							{foundFramework?.label}
						</div>
					) : (
						"Select status..."
					)}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder="Search status..."
						className="h-9"
					/>
					<CommandList>
						<CommandEmpty>No status found.</CommandEmpty>
						<CommandGroup>
							{frameworks.map((framework) => (
								<CommandItem
									key={framework.value}
									value={framework.value}
									onSelect={(currentValue) => {
										setValue(
											currentValue === value
												? ""
												: currentValue
										);
										setOpen(false);
									}}
								>
									<framework.icon className="mr-2 h-4 w-4" />
									{framework.label}
									<Check
										className={cn(
											"ml-auto",
											value === framework.value
												? "opacity-100"
												: "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
