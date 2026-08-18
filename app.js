const subjects = [
    "آیین دادرسی مدنی",
    "آیین دادرسی کیفری",
    "مدنی",
    "جزای اختصاصی",
    "جزای عمومی",
    "حقوق تجارت",
    "اصول فقه",
    "اساسی"
];

const subjectsContainer = document.getElementById("subjects");


// ==============================
// سربرگ جلسه‌ها
// ==============================

const sessionHeader = document.createElement("div");
sessionHeader.className = "session-header";

const emptyTitle = document.createElement("span");
emptyTitle.className = "empty-title";

sessionHeader.appendChild(emptyTitle);

for (let session = 1; session <= 40; session++) {

    const sessionNumber = document.createElement("span");

    sessionNumber.textContent = "جلسه " + session;
    sessionNumber.className = "session-number";

    sessionHeader.appendChild(sessionNumber);
}

subjectsContainer.appendChild(sessionHeader);


// ==============================
// گزارش پیشرفت
// ==============================

const progressSection = document.createElement("div");
progressSection.className = "progress-section";

const progressTitle = document.createElement("h2");
progressTitle.textContent = "گزارش پیشرفت";

progressSection.appendChild(progressTitle);

const progressItems = {};


// ==============================
// ساخت درس‌ها
// ==============================

subjects.forEach(function(subject) {

    const subjectRow = document.createElement("div");
    subjectRow.className = "subject-row";

    const subjectTitle = document.createElement("span");
    subjectTitle.textContent = subject;
    subjectTitle.className = "subject-title";

    subjectRow.appendChild(subjectTitle);


    // چک‌باکس‌های ۱ تا ۴۰
    for (let session = 1; session <= 40; session++) {

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const storageKey =
            subject + "-session-" + session;

        // خواندن وضعیت ذخیره‌شده
        checkbox.checked =
            localStorage.getItem(storageKey) === "done";


        checkbox.addEventListener("change", function() {

            if (checkbox.checked) {

                // ذخیره انجام جلسه
                localStorage.setItem(
                    storageKey,
                    "done"
                );

                // ذخیره تاریخ
                const dateKey =
                    storageKey + "-date";

                const today =
                    new Date().toLocaleDateString("fa-IR");

                localStorage.setItem(
                    dateKey,
                    today
                );

            } else {

                // حذف وضعیت جلسه
                localStorage.removeItem(storageKey);

                // حذف تاریخ جلسه
                const dateKey =
                    storageKey + "-date";

                localStorage.removeItem(dateKey);
            }


            updateProgress(subject);
            updateTotalProgress();
            showLastSession();
        });


        subjectRow.appendChild(checkbox);
    }


    subjectsContainer.appendChild(subjectRow);


    // ==============================
    // ساخت گزارش همین درس
    // ==============================

    const progressRow = document.createElement("div");
    progressRow.className = "progress-row";

    const progressSubject = document.createElement("span");
    progressSubject.textContent = subject;


    const progressPercent = document.createElement("span");
    progressPercent.className = "progress-percent";
    progressPercent.textContent = "0%";


    const progressText = document.createElement("span");
    progressText.className = "progress-text";
    progressText.textContent = "0 / 40";
    const remainingText = document.createElement("span");
remainingText.className = "remaining-text";
remainingText.textContent = "40 جلسه باقی‌مانده";


    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";


    const progressFill = document.createElement("div");
    progressFill.className = "progress-fill";


    progressBar.appendChild(progressFill);

    progressRow.appendChild(progressSubject);
progressRow.appendChild(progressPercent);
progressRow.appendChild(progressText);
progressRow.appendChild(remainingText);
progressRow.appendChild(progressBar);

    progressSection.appendChild(progressRow);


    progressItems[subject] = {
        text: progressText,
        percent: progressPercent,
        remaining: remainingText,
        fill: progressFill
    };
    
});


// اضافه کردن گزارش به صفحه
subjectsContainer.appendChild(progressSection);


// ==============================
// پیشرفت کلی همه درس‌ها
// ==============================

const totalProgress = document.createElement("div");
totalProgress.className = "total-progress";


const totalTitle = document.createElement("h2");
totalTitle.textContent = "پیشرفت کلی درس‌ها";


const totalText = document.createElement("div");
totalText.className = "total-text";


const totalBar = document.createElement("div");
totalBar.className = "total-bar";


const totalFill = document.createElement("div");
totalFill.className = "total-fill";


totalBar.appendChild(totalFill);

totalProgress.appendChild(totalTitle);
totalProgress.appendChild(totalText);
totalProgress.appendChild(totalBar);

subjectsContainer.appendChild(totalProgress);


// ==============================
// آخرین جلسه انجام‌شده
// ==============================

const lastSession = document.createElement("div");

lastSession.className = "last-session";

lastSession.textContent =
    "هنوز جلسه‌ای انجام نشده است";

subjectsContainer.appendChild(lastSession);


// ==============================
// محاسبه پیشرفت یک درس
// ==============================

function updateProgress(subject) {

    let completed = 0;


    for (let session = 1; session <= 40; session++) {

        const storageKey =
            subject + "-session-" + session;


        if (
            localStorage.getItem(storageKey) === "done"
        ) {
            completed++;
        }
    }


    const percent =
    (completed / 40) * 100;

const remaining = 40 - completed;

progressItems[subject].remaining.textContent =
    remaining + " جلسه باقی‌مانده";

    // تعداد جلسات
    progressItems[subject].text.textContent =
    completed + " / 40";
progressItems[subject].text.style.direction = "ltr";


    // درصد
    progressItems[subject].percent.textContent =
        percent.toFixed(1) + "%";


    // عرض نوار
    progressItems[subject].fill.style.width =
        percent + "%";


    // رنگ نوار
    if (percent < 30) {

        progressItems[subject]
            .fill.style.backgroundColor = "#e74c3c";

    } else if (percent < 70) {

        progressItems[subject]
            .fill.style.backgroundColor = "#f39c12";

    } else {

        progressItems[subject]
            .fill.style.backgroundColor = "#27ae60";
    }
}


// ==============================
// محاسبه پیشرفت کلی
// ==============================

function updateTotalProgress() {

    let completedTotal = 0;

    const totalSessions =
        subjects.length * 40;


    subjects.forEach(function(subject) {

        for (let session = 1; session <= 40; session++) {

            const storageKey =
                subject + "-session-" + session;


            if (
                localStorage.getItem(storageKey) === "done"
            ) {
                completedTotal++;
            }
        }
    });


    const percent =
        (completedTotal / totalSessions) * 100;


    totalText.textContent =
        completedTotal +
        " / " +
        totalSessions +
        " — " +
        percent.toFixed(1) +
        "%";


    totalFill.style.width =
        percent + "%";
        if (percent < 30) {
    totalFill.style.backgroundColor = "#e74c3c";
} else if (percent < 70) {
    totalFill.style.backgroundColor = "#f39c12";
} else {
    totalFill.style.backgroundColor = "#27ae60";
}
}


// ==============================
// نمایش آخرین جلسه انجام‌شده
// ==============================

function showLastSession() {

    let lastSubject = null;
    let lastSessionNumber = null;
    let lastDate = null;


    subjects.forEach(function(subject) {

        for (let session = 1; session <= 40; session++) {

            const dateKey =
                subject +
                "-session-" +
                session +
                "-date";


            const date =
                localStorage.getItem(dateKey);


            if (date) {

                lastSubject = subject;
                lastSessionNumber = session;
                lastDate = date;
            }
        }
    });


    if (lastSubject) {

        lastSession.textContent =
            "آخرین جلسه انجام‌شده: " +
            lastSubject +
            " — جلسه " +
            lastSessionNumber +
            " — " +
            lastDate;

    } else {

        lastSession.textContent =
            "هنوز جلسه‌ای انجام نشده است";
    }
}


// ==============================
// نمایش اطلاعات ذخیره‌شده
// ==============================

subjects.forEach(function(subject) {
    updateProgress(subject);
});

updateTotalProgress();

showLastSession();


// ==============================
// دکمه حذف همه پیشرفت‌ها
// ==============================

const clearAllButton =
    document.createElement("button");

clearAllButton.textContent =
    "پاک کردن همه پیشرفت‌ها 🗑️";

clearAllButton.className =
    "clear-all-button";


clearAllButton.addEventListener("click", function() {

    const confirmDelete = confirm(
        "آیا مطمئنی می‌خواهی پیشرفت همه درس‌ها پاک شود؟"
    );


    if (!confirmDelete) {
        return;
    }


    localStorage.clear();

    location.reload();
});


document.body.appendChild(clearAllButton);

document.body.appendChild(clearAllButton);


// دکمه ذخیره پشتیبان
const backupButton = document.createElement("button");

backupButton.textContent = "ذخیره پشتیبان 💾";
backupButton.className = "backup-button";

backupButton.addEventListener("click", function () {

    const backupData = {};

    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        backupData[key] = localStorage.getItem(key);
    }

    const jsonData = JSON.stringify(backupData, null, 2);

    const blob = new Blob(
        [jsonData],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "backup-dars.json";

    link.click();

    URL.revokeObjectURL(url);
});

document.body.appendChild(backupButton);

// دکمه بازیابی پشتیبان
const restoreButton = document.createElement("button");

restoreButton.textContent = "بازیابی پشتیبان 📂";
restoreButton.className = "restore-button";

const restoreInput = document.createElement("input");
restoreInput.type = "file";
restoreInput.accept = ".json";
restoreInput.style.display = "none";

restoreButton.addEventListener("click", function () {
    restoreInput.click();
});

restoreInput.addEventListener("change", function () {

    const file = restoreInput.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {

        try {

            const backupData = JSON.parse(reader.result);

            localStorage.clear();

            Object.keys(backupData).forEach(function (key) {

                localStorage.setItem(
                    key,
                    backupData[key]
                );
            });

            alert("پشتیبان با موفقیت بازیابی شد.");

            location.reload();

        } catch (error) {

            alert("فایل پشتیبان معتبر نیست.");
        }
    };

    reader.readAsText(file);
});

document.body.appendChild(restoreButton);
document.body.appendChild(restoreInput);
// ==============================
// یادآوری مطالعه
// ==============================

const reminderSection = document.createElement("div");
reminderSection.className = "reminder-section";

const reminderTitle = document.createElement("h2");
reminderTitle.textContent = "یادآوری مطالعه";

const reminderToggle = document.createElement("input");
reminderToggle.type = "checkbox";

const reminderLabel = document.createElement("label");
reminderLabel.textContent = " فعال کردن یادآوری";
reminderLabel.appendChild(reminderToggle);

const reminderTime = document.createElement("input");
reminderTime.type = "time";

const savedReminder = localStorage.getItem("study-reminder");
const savedTime = localStorage.getItem("study-reminder-time");

reminderToggle.checked = savedReminder === "on";
reminderTime.value = savedTime || "20:00";

reminderToggle.addEventListener("change", function () {

    if (reminderToggle.checked) {
        localStorage.setItem("study-reminder", "on");
    } else {
        localStorage.removeItem("study-reminder");
    }
});

reminderTime.addEventListener("change", function () {
    localStorage.setItem(
        "study-reminder-time",
        reminderTime.value
    );
});

reminderSection.appendChild(reminderTitle);
reminderSection.appendChild(reminderLabel);
reminderSection.appendChild(document.createElement("br"));
reminderSection.appendChild(reminderTime);

document.body.appendChild(reminderSection);

// ==============================
// فعال کردن اعلان‌های گوشی
// ==============================

const notificationButton = document.createElement("button");

notificationButton.textContent = "فعال کردن اعلان 🔔";
notificationButton.className = "notification-button";

document.body.appendChild(notificationButton);

notificationButton.addEventListener("click", async function () {

    if (!("serviceWorker" in navigator)) {
        alert("Service Worker در این مرورگر پشتیبانی نمی‌شود.");
        return;
    }

    try {

        const registration =
            await navigator.serviceWorker.ready;

        if (!registration.showNotification) {
            alert("این مرورگر از اعلان پشتیبانی نمی‌کند.");
            return;
        }

        await registration.showNotification("درس‌خوان 📚", {
            body: "اعلان‌ها با موفقیت فعال شدند.",
            icon: "./icon-192.png",
            badge: "./icon-192.png"
        });

    } catch (error) {

        console.error(error);

        alert("امکان فعال کردن اعلان وجود ندارد.");
    }
});
