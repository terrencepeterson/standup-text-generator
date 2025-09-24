import { TASK_STATUES } from '../config.mjs'
import { getNameFromValue } from './helpers.mjs'
import { checkbox } from '@inquirer/prompts'
import { confirm } from '@inquirer/prompts'
import { input } from '@inquirer/prompts'
import { select } from '@inquirer/prompts'
import PROJECT_CHOICES from '../projects.mjs'

async function getTaskConfig(projectName, blockers, shouldGetStatus) {
    const task = {}
    task.taskDescription = await input({ required: true, message: `Please describe the task (${projectName})` })
    task.taskUrl = await input({ 
        message: `Please provide the MiesterTask url (not required)`
    })
    if (shouldGetStatus) {
        task.taskStatus = await select({
            message: 'What is the status of the task',
            choices: TASK_STATUES,
        })
    }

    if (Object.hasOwn(task, 'taskStatus') && task.taskStatus === TASK_STATUES[1].value || task.taskStatus === TASK_STATUES[2].value) {
        const isBlocked = await confirm({ message: 'Is this task blocked', default: false });
        if (isBlocked) {
            const blocked = await input({ message: 'Why is it blocked?' })
            blockers.push({ ...task, blocked })
        }
    }

    const shouldContinue = await confirm({ message: `Are there other tasks for ${projectName}?` });
    if (shouldContinue) {
        const tasks = await getTaskConfig(projectName, blockers, shouldGetStatus)
        tasks.unshift(task)
        return tasks
    } else {
        return [task]
    }
}

export async function getDayConfig(message, shouldGetStatus, blockers) {
    const config = { message, projects: {} }
    const projects = await checkbox({
        message,
        required: true,
        choices: PROJECT_CHOICES
    })

    for (const projectValue of projects) {
        config.projects[projectValue] = await getTaskConfig(getNameFromValue(PROJECT_CHOICES, projectValue), blockers, shouldGetStatus)
    }

    return config
}

