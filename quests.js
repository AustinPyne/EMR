const quests = [
    {description: "Collect 10 trash pieces", goal: 10, progress: 0, type: "trash"},
    {description: "Collect a net power-up", goal: 1, progress: 0, type: "powerup"},
    {description: "Survive 30 seconds", goal: 30, progress: 0, type: "time"}
];

let currentQuestIndex = 0;

function getCurrentQuest() {
    return quests[currentQuestIndex];
}

function updateQuest(type) {
    const quest = getCurrentQuest();
    if(quest.type === type) {
        quest.progress++;
        if(quest.progress >= quest.goal) {
            currentQuestIndex++;
            if(currentQuestIndex >= quests.length) {
                alert("Congratulations! All quests completed!");
                resetGame();
            }
        }
        updateQuestUI();
    }
}

function updateQuestUI() {
    const quest = getCurrentQuest();
    if(quest) {
        document.getElementById("questBox").innerText = `Quest: ${quest.description} (${quest.progress}/${quest.goal})`;
    } else {
        document.getElementById("questBox").innerText = "All quests completed!";
    }
}

function resetQuests() {
    quests.forEach(q => q.progress = 0);
    currentQuestIndex = 0;
    updateQuestUI();
}
