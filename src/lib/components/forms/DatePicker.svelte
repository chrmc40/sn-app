<script lang="ts">
	import { Calendar, ChevronLeft, ChevronRight } from 'lucide-svelte';

	let {
		value = $bindable(''),
		placeholder = 'Select date...'
	} = $props<{
		value?: string;
		placeholder?: string;
	}>();

	let open = $state(false);
	let currentDate = $state(new Date());
	let viewMonth = $state(new Date().getMonth());
	let viewYear = $state(new Date().getFullYear());

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	function toggle() {
		open = !open;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.datepicker-container')) {
			open = false;
		}
	}

	function getDaysInMonth(month: number, year: number) {
		return new Date(year, month + 1, 0).getDate();
	}

	function getFirstDayOfMonth(month: number, year: number) {
		return new Date(year, month, 1).getDay();
	}

	function previousMonth() {
		if (viewMonth === 0) {
			viewMonth = 11;
			viewYear--;
		} else {
			viewMonth--;
		}
	}

	function nextMonth() {
		if (viewMonth === 11) {
			viewMonth = 0;
			viewYear++;
		} else {
			viewMonth++;
		}
	}

	function selectDate(day: number) {
		const date = new Date(viewYear, viewMonth, day);
		value = date.toISOString().split('T')[0];
		open = false;
	}

	function isSelected(day: number) {
		if (!value) return false;
		const selectedDate = new Date(value);
		return (
			selectedDate.getDate() === day &&
			selectedDate.getMonth() === viewMonth &&
			selectedDate.getFullYear() === viewYear
		);
	}

	function isToday(day: number) {
		const today = new Date();
		return (
			today.getDate() === day &&
			today.getMonth() === viewMonth &&
			today.getFullYear() === viewYear
		);
	}

	$effect(() => {
		if (open) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	const calendarDays = $derived(() => {
		const daysInMonth = getDaysInMonth(viewMonth, viewYear);
		const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
		const days: Array<number | null> = [];

		// Add empty cells for days before month starts
		for (let i = 0; i < firstDay; i++) {
			days.push(null);
		}

		// Add actual days
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}

		return days;
	});

	const displayValue = $derived(
		value ? new Date(value).toLocaleDateString() : placeholder
	);
</script>

<div class="datepicker-container">
	<button class="datepicker-trigger" onclick={toggle}>
		<span class="datepicker-label" class:placeholder={!value}>
			{displayValue}
		</span>
		<Calendar size={20} />
	</button>

	{#if open}
		<div class="datepicker-popup">
			<div class="calendar-header">
				<button class="nav-btn" onclick={previousMonth}>
					<ChevronLeft size={20} />
				</button>
				<span class="month-year">
					{monthNames[viewMonth]} {viewYear}
				</span>
				<button class="nav-btn" onclick={nextMonth}>
					<ChevronRight size={20} />
				</button>
			</div>

			<div class="calendar-grid">
				{#each dayNames as dayName}
					<div class="day-name">{dayName}</div>
				{/each}

				{#each calendarDays() as day}
					{#if day === null}
						<div class="calendar-day empty"></div>
					{:else}
						<button
							class="calendar-day"
							class:selected={isSelected(day)}
							class:today={isToday(day)}
							onclick={() => selectDate(day)}
						>
							{day}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.datepicker-container {
		position: relative;
		width: 100%;
	}

	.datepicker-trigger {
		width: 100%;
		padding: 12px 16px;
		background: var(--bg-input);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		color: var(--text-primary);
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: var(--ui-transition);
		text-align: left;
	}

	.datepicker-trigger:hover {
		border-color: var(--accent-subdued);
	}

	.datepicker-label {
		flex: 1;
	}

	.datepicker-label.placeholder {
		color: var(--text-muted);
	}

	.datepicker-popup {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
		z-index: var(--z-dropdown);
		padding: 16px;
		min-width: 300px;
		animation: slideDown 0.2s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.month-year {
		font-weight: 600;
		color: var(--text-primary);
	}

	.nav-btn {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-subdued);
		transition: var(--ui-transition);
	}

	.nav-btn:hover {
		background: var(--bg-tertiary);
		color: var(--text-primary);
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 4px;
	}

	.day-name {
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--text-subdued);
		padding: 8px 0;
	}

	.calendar-day {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		color: var(--text-primary);
		font-size: 14px;
		transition: var(--ui-transition);
	}

	.calendar-day:not(.empty):hover {
		background: var(--bg-tertiary);
	}

	.calendar-day.today {
		border: 2px solid var(--accent-subdued);
	}

	.calendar-day.selected {
		background: var(--accent-active);
		color: #000;
		font-weight: 600;
	}

	.calendar-day.empty {
		pointer-events: none;
	}
</style>
