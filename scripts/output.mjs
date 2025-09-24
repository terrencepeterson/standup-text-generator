import { TASK_STATUES } from "../config.mjs"
import PROJECT_CHOICES from '../projects.mjs'
import { getNameFromValue, getOrderFromValue, getTasksText, getBoldText } from "./helpers.mjs"

function getProjectOutput(projectValue, tasks) {
    let projectOutput = getBoldText(getNameFromValue(PROJECT_CHOICES, projectValue))
    const hasStatus = tasks.some(t => Object.hasOwn(t, 'taskStatus'))

    if (!hasStatus) {
        return getTasksText(projectOutput, tasks) + '\n'
    }

    const statusSortedTasks = {}
    for (const task of tasks) {
        if (Object.hasOwn(statusSortedTasks, task.taskStatus)) {
            statusSortedTasks[task.taskStatus].push(task)
        } else {
            statusSortedTasks[task.taskStatus] = [task]
        }
    }

    const taskStatusEntries = Object.entries(statusSortedTasks)
    // sorts into order according to the TASK_STATUS order property
    taskStatusEntries.sort((a, b) => getOrderFromValue(a[0]) - getOrderFromValue(b[0])) // remember a - b is ascending order
    for (const [taskStatusValue, tasks] of taskStatusEntries) {
        projectOutput += `\n${getNameFromValue(TASK_STATUES, taskStatusValue)}`
        projectOutput = getTasksText(projectOutput, tasks, true)
    }

    return projectOutput += '\n'
}

export function getDayOutput(config) {
    let output = config.message + '\n'

    for (const [projectValue, tasks] of Object.entries(config.projects)) {
        output += getProjectOutput(projectValue, tasks)
    }

    return output += '\n'
}

export function getBlockersOutput(blockers) {
    let output = ':no_entry: ' + getBoldText('Blockers:')
    return blockers.length ? getTasksText(output, blockers, false, true) : output + `\n${getBoldText('none')}`
}


