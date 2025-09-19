// Enhanced Application State
const AppState = {
  teachers: [],
  derivedClasses: [],
  derivedSubjects: [],
  derivedRooms: [],
  timetable: {
    classWise: {},
    teacherWise: {},
    fullSchedule: {},
  },
  generatedRoutineTypes: {
    classWise: false,
    teacherWise: false,
    fullSchedule: false,
  },
  teacherSlotAssignments: {},
  roomOccupancy: {},
};

// Constants
const DAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];
const PERIODS = [
  "১ম ঘন্টা",
  "২য় ঘন্টা",
  "৩য় ঘন্টা",
  "৪র্থ ঘন্টা",
  "বিরতি",
  "৫ম ঘন্টা",
  "৬ষ্ঠ ঘন্টা",
  "৭ম ঘন্টা",
];
const TIME_SLOTS = [
  "১০:১৫-১১:০৫",
  "১১:০৫-১১:৫০",
  "১১:৫০-১২:৩৫",
  "১২:৩৫-১:২০",
  "১:২০-২:০৫",
  "২:০৫-২:৪৫",
  "২:৪৫-৩:২৫",
  "৩:২৫-৪:০০",
];

// Predefined subjects from the routine image
const PREDEFINED_SUBJECTS = [
  "বাংলা ১ম",
  "বাংলা ২য়",
  "ইংরেজি ১ম",
  "ইংরেজি ২য়",
  "গণিত",
  "সাধারণ গণিত",
  "উচ্চতর গণিত",
  "বিজ্ঞান",
  "পদার্থ",
  "রসায়ন",
  "জীববিজ্ঞান",
  "বাংলাদেশ ও বিশ্বপরিচয়",
  "ইতিহাস",
  "ভূগোল",
  "পৌরনীতি",
  "অর্থনীতি",
  "ব্যবসায় উদ্যোগ",
  "মানবিক শিক্ষা",
  "ইসলাম ধর্ম",
  "হিন্দু ধর্ম",
  "খ্রিস্ট ধর্ম",
  "বৌদ্ধ ধর্ম",
  "কৃষি শিক্ষা",
  "গার্হস্থ্য বিজ্ঞান",
  "তথ্য ও যোগাযোগ প্রযুক্তি",
  "কম্পিউটার",
  "শারীরিক শিক্ষা",
  "চারু ও কারুকলা",
  "সংগীত",
];

const generateUniqueId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// Advanced School Routine Management System
class AdvancedSchoolRoutineApp {
  constructor() {
    this.initializeEventListeners();
    this.loadSavedData();
    this.deriveEntitiesFromTeachers();
    this.initializeTimetableStructures();
    this.renderAll();
  }

  initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", (e) =>
        this.switchTab(e.target.dataset.tab)
      );
    });

    // Modal triggers
    document.getElementById("addTeacherBtn").addEventListener("click", () => {
      this.resetTeacherModal();
      this.openModal("teacherModal");
    });

    document
      .getElementById("addAnotherSubjectBtn")
      .addEventListener("click", () => {
        this.addSubjectAssignmentGroup();
      });

    // Form submissions
    document
      .getElementById("teacherForm")
      .addEventListener("submit", (e) => this.addTeacher(e));

    // Modal close buttons
    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.closeModal(e.target.dataset.close)
      );
    });

    // Generation and export buttons
    document
      .getElementById("generateBtn")
      .addEventListener("click", () => this.generateAdvancedTimetable());
    document
      .getElementById("exportPdfBtn")
      .addEventListener("click", () => this.exportToPDF());
    document
      .getElementById("exportExcelBtn")
      .addEventListener("click", () => this.exportToExcel());
    document
      .getElementById("printBtn")
      .addEventListener("click", () => this.printRoutine());

    // View filters
    document
      .getElementById("viewClass")
      ?.addEventListener("change", () => this.filterTimetable());
    document
      .getElementById("viewTeacher")
      ?.addEventListener("change", () => this.filterTimetable());

    // Reports
    document
      .getElementById("generateReportBtn")
      ?.addEventListener("click", () => this.generateReport());

    // Modal backdrop clicks
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  // Enhanced Data Management
  deriveEntitiesFromTeachers() {
    const classesMap = new Map();
    const subjectsMap = new Map();
    const roomsMap = new Map();

    AppState.teachers.forEach((teacher) => {
      teacher.assignments.forEach((assignment) => {
        const classKey = assignment.classGrade.toString();

        if (!classesMap.has(classKey)) {
          classesMap.set(classKey, {
            id: generateUniqueId(),
            grade: assignment.classGrade,
            studentCount: 40,
            classTeacher: null,
          });
        }

        if (!subjectsMap.has(assignment.subjectName.toLowerCase())) {
          const colors = [
            "#3498db",
            "#e74c3c",
            "#9b59b6",
            "#f39c12",
            "#27ae60",
            "#34495e",
            "#16a085",
            "#e67e22",
            "#f1c40f",
            "#8e44ad",
            "#2ecc71",
            "#95a5a6",
            "#d35400",
            "#c0392b",
            "#7f8c8d",
          ];
          subjectsMap.set(assignment.subjectName.toLowerCase(), {
            id: generateUniqueId(),
            name: assignment.subjectName,
            dayRange: assignment.dayRange,
            daysPerWeek: assignment.daysPerWeek || 1,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        // Create virtual rooms based on class and subject
        const roomKey = `room-${
          assignment.classGrade
        }-${assignment.subjectName.charAt(0)}`;
        if (!roomsMap.has(roomKey)) {
          roomsMap.set(roomKey, {
            id: generateUniqueId(),
            name: `Room ${assignment.classGrade}${assignment.subjectName.charAt(
              0
            )}`,
            building: "Main Building",
            capacity: 40,
            fullName: `Room ${
              assignment.classGrade
            }${assignment.subjectName.charAt(0)} (Main Building)`,
          });
        }
      });
    });

    AppState.derivedClasses = Array.from(classesMap.values());
    AppState.derivedSubjects = Array.from(subjectsMap.values());
    AppState.derivedRooms = Array.from(roomsMap.values());
  }

  initializeTimetableStructures() {
    // Initialize class-wise timetable
    AppState.derivedClasses.forEach((cls) => {
      const classKey = cls.grade.toString();
      if (!AppState.timetable.classWise[classKey]) {
        AppState.timetable.classWise[classKey] = {};
      }
      DAYS.forEach((day) => {
        if (!AppState.timetable.classWise[classKey][day]) {
          AppState.timetable.classWise[classKey][day] = {};
        }
        PERIODS.forEach((period) => {
          if (
            period !== "বিরতি" &&
            !AppState.timetable.classWise[classKey][day][period]
          ) {
            AppState.timetable.classWise[classKey][day][period] = null;
          }
        });
      });
    });

    // Initialize teacher-wise timetable
    AppState.timetable.teacherWise = {};
    AppState.teachers.forEach((teacher) => {
      AppState.timetable.teacherWise[teacher.id] = {};
      DAYS.forEach((day) => {
        AppState.timetable.teacherWise[teacher.id][day] = {};
        PERIODS.forEach((period) => {
          if (period !== "বিরতি") {
            AppState.timetable.teacherWise[teacher.id][day][period] = null;
          }
        });
      });
    });

    // Initialize full schedule
    AppState.timetable.fullSchedule = {};
    DAYS.forEach((day) => {
      AppState.timetable.fullSchedule[day] = {};
      PERIODS.forEach((period) => {
        if (period !== "বিরতি") {
          AppState.timetable.fullSchedule[day][period] = [];
        }
      });
    });

    this.initializeRoomOccupancy();

    // Initialize teacher slot assignments tracker
    AppState.teacherSlotAssignments = {};
    AppState.teachers.forEach((teacher) => {
      AppState.teacherSlotAssignments[teacher.id] = {};
      teacher.assignments.forEach((assignment) => {
        const key = `${assignment.subjectName}-${assignment.classGrade}`;
        AppState.teacherSlotAssignments[teacher.id][key] = {
          assignedSlot: null,
          subjectName: assignment.subjectName,
          classKey: assignment.classGrade.toString(),
          dayRange: assignment.dayRange,
          daysPerWeek: assignment.daysPerWeek || 1,
          assignedDays: 0,
        };
      });
    });
  }

  initializeRoomOccupancy() {
    AppState.roomOccupancy = {};
    DAYS.forEach((day) => {
      AppState.roomOccupancy[day] = {};
      PERIODS.filter((p) => p !== "বিরতি").forEach((period) => {
        AppState.roomOccupancy[day][period] = new Set();
      });
    });
  }

  loadSavedData() {
    try {
      const savedAppState = localStorage.getItem(
        "advancedSchoolRoutineAppState"
      );
      const savedTimetable = localStorage.getItem(
        "advancedSchoolRoutineTimetable"
      );

      if (savedAppState) {
        const parsedState = JSON.parse(savedAppState);
        AppState.teachers = parsedState.teachers || [];
      }

      if (savedTimetable) {
        AppState.timetable = JSON.parse(savedTimetable);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }

  saveData() {
    try {
      localStorage.setItem(
        "advancedSchoolRoutineAppState",
        JSON.stringify({
          teachers: AppState.teachers,
          generatedRoutineTypes: AppState.generatedRoutineTypes,
        })
      );
      localStorage.setItem(
        "advancedSchoolRoutineTimetable",
        JSON.stringify(AppState.timetable)
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  renderAll() {
    this.deriveEntitiesFromTeachers();
    this.updateStatistics();
    this.renderTeachers();
    this.setupDropdowns();
    this.renderTimetable();
  }

  // UI Management
  switchTab(tabName) {
    document
      .querySelectorAll(".nav-tab")
      .forEach((tab) => tab.classList.remove("active"));
    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.remove("active"));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
    document.getElementById(tabName).classList.add("active");

    if (tabName === "timetable") {
      this.renderTimetable();
    }
  }

  openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
  }

  updateStatistics() {
    this.deriveEntitiesFromTeachers();
    document.getElementById("totalTeachers").textContent =
      AppState.teachers.length;
    document.getElementById("totalClasses").textContent =
      AppState.derivedClasses.length;
    document.getElementById("totalSubjects").textContent =
      AppState.derivedSubjects.length;
    document.getElementById("totalRooms").textContent =
      AppState.derivedRooms.length;
  }

  // Enhanced Teacher Management with subject dropdown
  resetTeacherModal() {
    const teacherForm = document.getElementById("teacherForm");
    teacherForm.reset();
    teacherForm.dataset.mode = "add";
    teacherForm.dataset.teacherId = "";

    document.querySelector("#teacherModal h3").textContent = "Add New Teacher";
    document.querySelector("#teacherModal button[type='submit']").textContent =
      "Add Teacher";

    const subjectsContainer = document.getElementById(
      "teacherSubjectsContainer"
    );
    subjectsContainer.innerHTML = `
            <h4>Subject & Class Assignments</h4>
            <div class="subject-assignment-group" data-assignment-id="0">
                <div class="form-group">
                    <label>Subject Name *</label>
                    <div class="subject-dropdown-container">
                        <input type="text" class="form-control subject-name" placeholder="Search or select subject..." required>
                        <div class="subject-dropdown" id="subjectDropdown0">
                            <!-- Options will be populated by JavaScript -->
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Class Days (1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu) *</label>
                    <select class="form-control day-range" required>
                        <option value="">Select day range or specific day</option>
                        <option value="1-2">1-2 (Sunday to Monday)</option>
                        <option value="1-3">1-3 (Sunday to Tuesday)</option>
                        <option value="1-4">1-4 (Sunday to Wednesday)</option>
                        <option value="1-5">1-5 (Sunday to Thursday)</option>
                        <option value="2-3">2-3 (Monday to Tuesday)</option>
                        <option value="2-4">2-4 (Monday to Wednesday)</option>
                        <option value="2-5">2-5 (Monday to Thursday)</option>
                        <option value="3-4">3-4 (Tuesday to Wednesday)</option>
                        <option value="3-5">3-5 (Tuesday to Thursday)</option>
                        <option value="4-5">4-5 (Wednesday to Thursday)</option>
                        <option value="1">1 (Sunday only)</option>
                        <option value="2">2 (Monday only)</option>
                        <option value="3">3 (Tuesday only)</option>
                        <option value="4">4 (Wednesday only)</option>
                        <option value="5">5 (Thursday only)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Class Grade (6-10) *</label>
                    <input type="number" class="form-control class-grade" min="6" max="10" required>
                </div>
                <button type="button" class="btn btn-danger remove-subject-assignment hidden">Remove Subject</button>
            </div>
        `;

    this.setupSubjectDropdown(0);
  }

  setupSubjectDropdown(assignmentId) {
    const subjectInput = document.querySelector(
      `[data-assignment-id="${assignmentId}"] .subject-name`
    );
    const dropdown = document.getElementById(`subjectDropdown${assignmentId}`);

    if (!subjectInput || !dropdown) return;

    // Populate dropdown with predefined subjects
    dropdown.innerHTML = PREDEFINED_SUBJECTS.map(
      (subject) =>
        `<div class="subject-option" data-value="${subject}">${subject}</div>`
    ).join("");

    // Handle input events
    subjectInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const options = dropdown.querySelectorAll(".subject-option");

      options.forEach((option) => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          option.style.display = "block";
        } else {
          option.style.display = "none";
        }
      });

      dropdown.style.display = "block";
    });

    // Handle focus events
    subjectInput.addEventListener("focus", () => {
      dropdown.style.display = "block";
    });

    // Handle option selection
    dropdown.addEventListener("click", (e) => {
      if (e.target.classList.contains("subject-option")) {
        subjectInput.value = e.target.dataset.value;
        dropdown.style.display = "none";
      }
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!subjectInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  addSubjectAssignmentGroup() {
    const subjectsContainer = document.getElementById(
      "teacherSubjectsContainer"
    );
    const newAssignmentId = subjectsContainer.children.length;

    const newGroup = document.createElement("div");
    newGroup.className = "subject-assignment-group";
    newGroup.dataset.assignmentId = newAssignmentId;
    newGroup.innerHTML = `
            <div class="form-group">
                <label>Subject Name *</label>
                <div class="subject-dropdown-container">
                    <input type="text" class="form-control subject-name" placeholder="Search or select subject..." required>
                    <div class="subject-dropdown" id="subjectDropdown${newAssignmentId}">
                        <!-- Options will be populated by JavaScript -->
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Class Days (1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu) *</label>
                <select class="form-control day-range" required>
                    <option value="">Select day range or specific day</option>
                    <option value="1-2">1-2 (Sunday to Monday)</option>
                    <option value="1-3">1-3 (Sunday to Tuesday)</option>
                    <option value="1-4">1-4 (Sunday to Wednesday)</option>
                    <option value="1-5">1-5 (Sunday to Thursday)</option>
                    <option value="2-3">2-3 (Monday to Tuesday)</option>
                    <option value="2-4">2-4 (Monday to Wednesday)</option>
                    <option value="2-5">2-5 (Monday to Thursday)</option>
                    <option value="3-4">3-4 (Tuesday to Wednesday)</option>
                    <option value="3-5">3-5 (Tuesday to Thursday)</option>
                    <option value="4-5">4-5 (Wednesday to Thursday)</option>
                    <option value="1">1 (Sunday only)</option>
                    <option value="2">2 (Monday only)</option>
                    <option value="3">3 (Tuesday only)</option>
                    <option value="4">4 (Wednesday only)</option>
                    <option value="5">5 (Thursday only)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Class Grade (6-10) *</label>
                <input type="number" class="form-control class-grade" min="6" max="10" required>
            </div>
            <button type="button" class="btn btn-danger remove-subject-assignment">Remove Subject</button>
        `;
    subjectsContainer.appendChild(newGroup);

    newGroup
      .querySelector(".remove-subject-assignment")
      .addEventListener("click", (e) => {
        e.target.closest(".subject-assignment-group").remove();
        this.updateRemoveButtonVisibility();
      });

    this.setupSubjectDropdown(newAssignmentId);
    this.updateRemoveButtonVisibility();
  }

  updateRemoveButtonVisibility() {
    const assignmentGroups = document.querySelectorAll(
      ".subject-assignment-group"
    );
    assignmentGroups.forEach((group, index) => {
      const removeBtn = group.querySelector(".remove-subject-assignment");
      if (removeBtn) {
        if (assignmentGroups.length === 1 || index === 0) {
          removeBtn.classList.add("hidden");
        } else {
          removeBtn.classList.remove("hidden");
        }
      }
    });
  }

  addTeacher(event) {
    event.preventDefault();

    const teacherForm = event.target;
    const mode = teacherForm.dataset.mode || "add";
    const teacherId = teacherForm.dataset.teacherId;

    const teacherNameInput = document.getElementById("teacherName");
    const teacherRankInput = document.getElementById("teacherRank");

    if (!teacherNameInput.value.trim()) {
      this.showAlert("danger", "Teacher name cannot be empty.");
      return;
    }

    if (!teacherRankInput.value.trim()) {
      this.showAlert("danger", "Please select teacher rank.");
      return;
    }

    const assignments = [];
    let isValid = true;

    document.querySelectorAll(".subject-assignment-group").forEach((group) => {
      const subjectName = group.querySelector(".subject-name").value.trim();
      const dayRange = group.querySelector(".day-range").value;
      const classGrade = parseInt(group.querySelector(".class-grade").value);

      if (!subjectName || !dayRange || !classGrade) {
        this.showAlert(
          "danger",
          "Please fill all assignment fields for each subject."
        );
        isValid = false;
        return;
      }

      // Parse day range - handle both range format and single number format
      let daysPerWeek = 1;
      if (dayRange.includes("-")) {
        // Range format like "1-3"
        const [startDay, endDay] = dayRange.split("-").map(Number);
        daysPerWeek = endDay - startDay + 1;
      } else {
        // Single number format like "1" (Sunday only), "2" (Monday only)
        daysPerWeek = 1; // For single day selection, it's always 1 day per week
      }

      assignments.push({
        subjectName,
        dayRange,
        daysPerWeek,
        classGrade,
      });
    });

    if (!isValid || assignments.length === 0) {
      return;
    }

    if (mode === "edit" && teacherId) {
      const teacherIndex = AppState.teachers.findIndex(
        (t) => t.id === teacherId
      );
      if (teacherIndex !== -1) {
        AppState.teachers[teacherIndex] = {
          ...AppState.teachers[teacherIndex],
          name: teacherNameInput.value.trim(),
          rank: teacherRankInput.value.trim(),
          assignments: assignments,
        };
        this.clearGeneratedRoutines();
        this.renderAll();
        this.closeModal("teacherModal");
        this.saveData();
        this.showAlert("success", "Teacher updated successfully!");
        return;
      }
    } else {
      const teacherData = {
        id: generateUniqueId(),
        name: teacherNameInput.value.trim(),
        rank: teacherRankInput.value.trim(),
        assignments: assignments,
      };

      AppState.teachers.push(teacherData);
      this.renderAll();
      this.closeModal("teacherModal");
      this.saveData();
      this.showAlert("success", "Teacher added successfully!");
    }
  }

  renderTeachers() {
    const container = document.getElementById("teachersList");
    container.innerHTML = "";

    if (AppState.teachers.length === 0) {
      container.innerHTML =
        '<div class="data-item"><div class="data-info">No teachers added yet. Click "Add New Teacher" to get started.</div></div>';
      return;
    }

    AppState.teachers.forEach((teacher) => {
      const assignmentsHtml = teacher.assignments
        .map(
          (assignment) => `
                <li>
                    <strong>${assignment.subjectName}</strong> for Class ${
            assignment.classGrade
          }
                    - Days: ${assignment.dayRange} (${
            assignment.daysPerWeek || 1
          } days/week)
                </li>
            `
        )
        .join("");

      const teacherElement = document.createElement("div");
      teacherElement.className = "data-item";
      teacherElement.innerHTML = `
                <div class="data-info">
                    <strong>${teacher.name}</strong> - <span class="teacher-rank">${teacher.rank}</span><br>
                    <small>Assignments:</small>
                    <ul>${assignmentsHtml}</ul>
                </div>
                <div class="data-actions">
                    <button class="btn btn-secondary" onclick="app.editTeacher('${teacher.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteTeacher('${teacher.id}')">Delete</button>
                </div>
            `;
      container.appendChild(teacherElement);
    });
  }

  editTeacher(teacherId) {
    const teacher = AppState.teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    const teacherForm = document.getElementById("teacherForm");
    teacherForm.dataset.mode = "edit";
    teacherForm.dataset.teacherId = teacherId;

    document.querySelector("#teacherModal h3").textContent = "Edit Teacher";
    document.querySelector("#teacherModal button[type='submit']").textContent =
      "Update Teacher";

    document.getElementById("teacherName").value = teacher.name;
    document.getElementById("teacherRank").value = teacher.rank || "";

    const subjectsContainer = document.getElementById(
      "teacherSubjectsContainer"
    );
    subjectsContainer.innerHTML = "<h4>Subject & Class Assignments</h4>";

    teacher.assignments.forEach((assignment, index) => {
      if (index === 0) {
        const firstGroup = document.createElement("div");
        firstGroup.className = "subject-assignment-group";
        firstGroup.dataset.assignmentId = "0";
        firstGroup.innerHTML = `
                    <div class="form-group">
                        <label>Subject Name *</label>
                        <div class="subject-dropdown-container">
                            <input type="text" class="form-control subject-name" value="${assignment.subjectName}" required>
                            <div class="subject-dropdown" id="subjectDropdown0">
                                <!-- Options will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Class Days (1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu) *</label>
                        <select class="form-control day-range" required>
                            <option value="">Select day range or specific day</option>
                            <option value="1-2">1-2 (Sunday to Monday)</option>
                            <option value="1-3">1-3 (Sunday to Tuesday)</option>
                            <option value="1-4">1-4 (Sunday to Wednesday)</option>
                            <option value="1-5">1-5 (Sunday to Thursday)</option>
                            <option value="2-3">2-3 (Monday to Tuesday)</option>
                            <option value="2-4">2-4 (Monday to Wednesday)</option>
                            <option value="2-5">2-5 (Monday to Thursday)</option>
                            <option value="3-4">3-4 (Tuesday to Wednesday)</option>
                            <option value="3-5">3-5 (Tuesday to Thursday)</option>
                            <option value="4-5">4-5 (Wednesday to Thursday)</option>
                            <option value="1">1 (Sunday only)</option>
                            <option value="2">2 (Monday only)</option>
                            <option value="3">3 (Tuesday only)</option>
                            <option value="4">4 (Wednesday only)</option>
                            <option value="5">5 (Thursday only)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Class Grade (6-10) *</label>
                        <input type="number" class="form-control class-grade" value="${assignment.classGrade}" min="6" max="10" required>
                    </div>
                    <button type="button" class="btn btn-danger remove-subject-assignment hidden">Remove Subject</button>
                `;
        subjectsContainer.appendChild(firstGroup);
        firstGroup.querySelector(".day-range").value = assignment.dayRange;
        this.setupSubjectDropdown(0);
      } else {
        const newGroup = document.createElement("div");
        newGroup.className = "subject-assignment-group";
        newGroup.dataset.assignmentId = index;
        newGroup.innerHTML = `
                    <div class="form-group">
                        <label>Subject Name *</label>
                        <div class="subject-dropdown-container">
                            <input type="text" class="form-control subject-name" value="${assignment.subjectName}" required>
                            <div class="subject-dropdown" id="subjectDropdown${index}">
                                <!-- Options will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Class Days (1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu) *</label>
                        <select class="form-control day-range" required>
                            <option value="">Select day range or specific day</option>
                            <option value="1-2">1-2 (Sunday to Monday)</option>
                            <option value="1-3">1-3 (Sunday to Tuesday)</option>
                            <option value="1-4">1-4 (Sunday to Wednesday)</option>
                            <option value="1-5">1-5 (Sunday to Thursday)</option>
                            <option value="2-3">2-3 (Monday to Tuesday)</option>
                            <option value="2-4">2-4 (Monday to Wednesday)</option>
                            <option value="2-5">2-5 (Monday to Thursday)</option>
                            <option value="3-4">3-4 (Tuesday to Wednesday)</option>
                            <option value="3-5">3-5 (Tuesday to Thursday)</option>
                            <option value="4-5">4-5 (Wednesday to Thursday)</option>
                            <option value="1">1 (Sunday only)</option>
                            <option value="2">2 (Monday only)</option>
                            <option value="3">3 (Tuesday only)</option>
                            <option value="4">4 (Wednesday only)</option>
                            <option value="5">5 (Thursday only)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Class Grade (6-10) *</label>
                        <input type="number" class="form-control class-grade" value="${assignment.classGrade}" min="6" max="10" required>
                    </div>
                    <button type="button" class="btn btn-danger remove-subject-assignment">Remove Subject</button>
                `;
        subjectsContainer.appendChild(newGroup);
        newGroup.querySelector(".day-range").value = assignment.dayRange;
        this.setupSubjectDropdown(index);

        newGroup
          .querySelector(".remove-subject-assignment")
          .addEventListener("click", (e) => {
            e.target.closest(".subject-assignment-group").remove();
            this.updateRemoveButtonVisibility();
          });
      }
    });

    this.updateRemoveButtonVisibility();
    this.openModal("teacherModal");
  }

  deleteTeacher(id) {
    if (
      confirm(
        "Are you sure you want to delete this teacher? This will clear all generated routines."
      )
    ) {
      AppState.teachers = AppState.teachers.filter((t) => t.id !== id);
      this.clearGeneratedRoutines();
      this.renderAll();
      this.saveData();
      this.showAlert("success", "Teacher deleted successfully!");
    }
  }

  // Enhanced Conflict-Free Timetable Generation with Days Per Week Support
  generateAdvancedTimetable() {
    if (AppState.teachers.length === 0) {
      this.showAlert(
        "danger",
        "Please add teachers with their assignments before generating timetable"
      );
      return;
    }

    const loading = document.getElementById("generationLoading");
    const stepElement = document.getElementById("loadingStep");
    loading.classList.add("active");

    const steps = [
      "Initializing conflict-free scheduling system...",
      "Analyzing day ranges and teacher schedules...",
      "Implementing advanced conflict detection algorithms...",
      "Assigning time slots based on day requirements...",
      "Generating comprehensive schedule views...",
      "Validating complete routine for conflicts...",
    ];

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        stepElement.textContent = steps[currentStep];
        currentStep++;
      } else {
        clearInterval(stepInterval);
        this.executeConflictFreeGeneration();
        loading.classList.remove("active");
        this.showAlert(
          "success",
          "Conflict-free routine generated successfully! Zero conflicts guaranteed."
        );
        this.switchTab("timetable");
      }
    }, 800);
  }

  executeConflictFreeGeneration() {
    this.clearGeneratedRoutines();
    this.deriveEntitiesFromTeachers();
    this.initializeTimetableStructures();

    // Reset teacherSlotAssignments for a fresh generation attempt
    AppState.teacherSlotAssignments = {};
    AppState.teachers.forEach((teacher) => {
      AppState.teacherSlotAssignments[teacher.id] = {};
      teacher.assignments.forEach((assignment) => {
        const key = `${assignment.subjectName}-${assignment.classGrade}`;
        AppState.teacherSlotAssignments[teacher.id][key] = {
          assignedSlot: null,
          subjectName: assignment.subjectName,
          classKey: assignment.classGrade.toString(),
          dayRange: assignment.dayRange,
          daysPerWeek: assignment.daysPerWeek || 1,
          assignedDays: 0,
        };
      });
    });

    const success = this.executeConflictFreeSchedulingAlgorithm();

    if (success) {
      this.generateTeacherWiseFromClassWise();
      this.generateFullScheduleFromClassWise();

      // এই line গুলো important - এখানে আমি সব types কে true করে দিয়েছি
      AppState.generatedRoutineTypes.classWise = true;
      AppState.generatedRoutineTypes.teacherWise = true;
      AppState.generatedRoutineTypes.fullSchedule = true;

      this.setupViewFilters();
      this.renderTimetable();
      this.saveData();
    } else {
      this.showAlert(
        "warning",
        "Could not generate completely conflict-free routine. Please check teacher assignments."
      );
    }
  }

  executeConflictFreeSchedulingAlgorithm() {
    const actualPeriods = PERIODS.filter((p) => p !== "বিরতি");
    let allAssigned = true;

    const assignmentQueue = this.createPrioritizedAssignmentQueue();

    for (const assignment of assignmentQueue) {
      const success = this.assignSubjectWithDaysPerWeek(
        assignment,
        actualPeriods
      );
      if (!success) {
        console.warn(
          `Could not assign ${assignment.subjectName} for class ${assignment.classKey}`
        );
        allAssigned = false;
      }
    }

    return allAssigned;
  }

  createPrioritizedAssignmentQueue() {
    const queue = [];

    AppState.teachers.forEach((teacher) => {
      teacher.assignments.forEach((assignment) => {
        const priority = this.calculateAssignmentPriority(assignment);
        queue.push({
          teacherId: teacher.id,
          teacherName: teacher.name,
          teacherRank: teacher.rank,
          subjectName: assignment.subjectName,
          classKey: assignment.classGrade.toString(),
          classGrade: assignment.classGrade,
          dayRange: assignment.dayRange,
          daysPerWeek: assignment.daysPerWeek || 1,
          priority: priority,
          // Add a random factor to ensure different combinations on re-generation
          randomFactor: Math.random(),
        });
      });
    });

    // Sort by priority (descending) and then by random factor for varied combinations
    return queue.sort(
      (a, b) => b.priority - a.priority || b.randomFactor - a.randomFactor
    );
  }

  calculateAssignmentPriority(assignment) {
    let priority = 0;

    // Priority based on days per week
    const daysPerWeek = assignment.daysPerWeek || 1;
    priority += daysPerWeek * 10;

    const coreSubjects = [
      "গণিত",
      "বাংলা",
      "ইংরেজি",
      "বিজ্ঞান",
      "পদার্থ",
      "রসায়ন",
      "জীববিজ্ঞান",
    ];
    if (coreSubjects.some((core) => assignment.subjectName.includes(core))) {
      priority += 50;
    }

    priority += assignment.classGrade * 5;
    return priority;
  }

  assignSubjectWithDaysPerWeek(assignment, actualPeriods) {
    const daysPerWeek = assignment.daysPerWeek || 1;
    const availableSlots = this.findAvailableSlotsForDaysPerWeek(
      assignment,
      actualPeriods,
      daysPerWeek
    );

    if (availableSlots.length < daysPerWeek) {
      return false;
    }

    // Select best slots for the subject
    const selectedSlots = availableSlots.slice(0, daysPerWeek);
    return this.assignSubjectToMultipleSlots(assignment, selectedSlots);
  }

  findAvailableSlotsForDaysPerWeek(assignment, actualPeriods, daysPerWeek) {
    const availableSlots = [];
    const classKey = assignment.classKey;
    const teacher = AppState.teachers.find(
      (t) => t.id === assignment.teacherId
    );

    // Determine valid periods based on teacher rank and subject type
    let periodsToConsider = [...actualPeriods];

    // 1. Head Teacher / Assistant Head Teacher restriction (no 1st, 2nd period)
    if (
      teacher &&
      (teacher.rank === "প্রধান শিক্ষক" ||
        teacher.rank === "সহকারী প্রধান শিক্ষক")
    ) {
      periodsToConsider = periodsToConsider.filter(
        (p) => p !== "১ম ঘন্টা" && p !== "২য় ঘন্টা"
      );
    }

    // 2. Group-wise subjects (বাংলা, ইংরেজি, গণিত, বিজ্ঞান) start from 3rd period
    const groupSubjects = [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "পদার্থ",
      "রসায়ন",
      "জীববিজ্ঞান",
    ];
    const isGroupSubject = groupSubjects.some((sub) =>
      assignment.subjectName.includes(sub)
    );

    if (isGroupSubject) {
      periodsToConsider = periodsToConsider.filter(
        (p) => p !== "১ম ঘন্টা" && p !== "২য় ঘন্টা"
      );
    }

    // Check if it's a day range or specific day
    const isRangeFormat = assignment.dayRange.includes("-");
    const isSpecificDay =
      !isRangeFormat && !isNaN(parseInt(assignment.dayRange));

    if (isRangeFormat) {
      // Handle range format (e.g., "1-3")
      const [startDay, endDay] = assignment.dayRange.split("-").map(Number);

      for (const period of periodsToConsider) {
        // Use filtered periods
        let isSlotAvailable = true;

        // Check if this slot is available for all days in the range
        for (let dayIndex = startDay - 1; dayIndex < endDay; dayIndex++) {
          const day = DAYS[dayIndex];

          if (this.isTeacherBusyInSlot(assignment.teacherId, day, period)) {
            isSlotAvailable = false;
            break;
          }

          if (AppState.timetable.classWise[classKey]?.[day]?.[period]) {
            isSlotAvailable = false;
            break;
          }
        }

        if (isSlotAvailable) {
          // Add all days in range to the slot
          for (let dayIndex = startDay - 1; dayIndex < endDay; dayIndex++) {
            availableSlots.push({
              period: period,
              day: DAYS[dayIndex],
              dayIndex: dayIndex,
            });
          }
        }
      }
    } else if (isSpecificDay) {
      // Handle specific day format (e.g., "1" means Sunday only)
      const specificDayIndex = parseInt(assignment.dayRange) - 1; // 0-indexed
      const specificDay = DAYS[specificDayIndex];

      for (const period of periodsToConsider) {
        // Use filtered periods
        if (
          !this.isTeacherBusyInSlot(
            assignment.teacherId,
            specificDay,
            period
          ) &&
          !AppState.timetable.classWise[classKey]?.[specificDay]?.[period]
        ) {
          availableSlots.push({
            period: period,
            day: specificDay,
            dayIndex: specificDayIndex,
          });
        }
      }
    } else {
      // Fallback for any days per week (though the options are now specific)
      for (const period of periodsToConsider) {
        // Use filtered periods
        const availableDaysForPeriod = [];

        DAYS.forEach((day, dayIndex) => {
          if (
            !this.isTeacherBusyInSlot(assignment.teacherId, day, period) &&
            !AppState.timetable.classWise[classKey]?.[day]?.[period]
          ) {
            availableDaysForPeriod.push({
              period: period,
              day: day,
              dayIndex: dayIndex,
            });
          }
        });

        // If we have enough available days for this period, add them
        if (availableDaysForPeriod.length >= daysPerWeek) {
          availableSlots.push(...availableDaysForPeriod.slice(0, daysPerWeek));
        }
      }
    }

    return availableSlots;
  }

  isTeacherBusyInSlot(teacherId, day, period) {
    for (const classKey of Object.keys(AppState.timetable.classWise)) {
      const slot = AppState.timetable.classWise[classKey]?.[day]?.[period];
      if (slot && slot.teacherId === teacherId) {
        return true;
      }
    }
    return false;
  }

  assignSubjectToMultipleSlots(assignment, slots) {
    const classKey = assignment.classKey;
    const subject = AppState.derivedSubjects.find(
      (s) => s.name === assignment.subjectName
    );

    if (!subject) {
      console.error(`Subject not found for assignment:`, assignment);
      return false;
    }

    // Check for conflicts before assigning
    for (const slot of slots) {
      if (
        this.isTeacherBusyInSlot(assignment.teacherId, slot.day, slot.period) ||
        AppState.timetable.classWise[classKey]?.[slot.day]?.[slot.period]
      ) {
        console.error(
          `Conflict detected during assignment for ${assignment.subjectName} on ${slot.day} at ${slot.period}`
        );
        return false;
      }
    }

    // Assign to all selected slots
    for (const slot of slots) {
      if (!AppState.timetable.classWise[classKey]) {
        AppState.timetable.classWise[classKey] = {};
      }
      if (!AppState.timetable.classWise[classKey][slot.day]) {
        AppState.timetable.classWise[classKey][slot.day] = {};
      }

      AppState.timetable.classWise[classKey][slot.day][slot.period] = {
        classId: `class-${classKey}`,
        subjectId: subject.id,
        teacherId: assignment.teacherId,
        subject: assignment.subjectName,
        teacher: assignment.teacherName,
        teacherRank: assignment.teacherRank,
        room: `Room ${classKey}${assignment.subjectName.charAt(0)}`,
        building: "Main Building",
        dayRange: assignment.dayRange,
        daysPerWeek: assignment.daysPerWeek || 1,
      };
    }

    return true;
  }

  generateTeacherWiseFromClassWise() {
    AppState.teachers.forEach((teacher) => {
      AppState.timetable.teacherWise[teacher.id] = {};
      DAYS.forEach((day) => {
        AppState.timetable.teacherWise[teacher.id][day] = {};
        PERIODS.forEach((period) => {
          if (period === "বিরতি") return;

          let assignedSlot = null;
          for (const classKey in AppState.timetable.classWise) {
            const slot =
              AppState.timetable.classWise[classKey]?.[day]?.[period];
            if (slot && slot.teacherId === teacher.id) {
              assignedSlot = { ...slot, classKey };
              break;
            }
          }
          AppState.timetable.teacherWise[teacher.id][day][period] =
            assignedSlot;
        });
      });
    });
  }

  generateFullScheduleFromClassWise() {
    DAYS.forEach((day) => {
      AppState.timetable.fullSchedule[day] = {};
      PERIODS.forEach((period) => {
        if (period === "বিরতি") return;

        AppState.timetable.fullSchedule[day][period] = [];

        Object.keys(AppState.timetable.classWise).forEach((classKey) => {
          const slot = AppState.timetable.classWise[classKey]?.[day]?.[period];
          if (slot) {
            AppState.timetable.fullSchedule[day][period].push({
              ...slot,
              classKey: classKey,
            });
          }
        });

        AppState.timetable.fullSchedule[day][period].sort((a, b) => {
          return a.classKey.localeCompare(b.classKey);
        });
      });
    });
  }

  clearGeneratedRoutines() {
    AppState.timetable.classWise = {};
    AppState.timetable.teacherWise = {};
    AppState.timetable.fullSchedule = {};
    AppState.generatedRoutineTypes = {
      classWise: false,
      teacherWise: false,
      fullSchedule: false,
    };
    AppState.teacherSlotAssignments = {};
    this.initializeTimetableStructures();
  }

  // Enhanced Timetable Rendering
  renderTimetable() {
    const container = document.getElementById("timetableGrid");
    container.innerHTML = "";

    this.addScheduleTypeSelector(container);

    const classFilter = document.getElementById("viewClass")?.value;
    const teacherFilter = document.getElementById("viewTeacher")?.value;
    const scheduleType =
      document.querySelector('input[name="scheduleType"]:checked')?.value ||
      "classWise";

    if (scheduleType === "fullSchedule") {
      this.renderProfessionalFullScheduleView(container);
    } else if (teacherFilter && scheduleType === "teacherWise") {
      this.renderTeacherWiseRoutine(container, teacherFilter);
    } else if (scheduleType === "classWise") {
      this.renderClassWiseRoutine(container, classFilter);
    }

    this.performEnhancedConflictAnalysis();
  }

  addScheduleTypeSelector(container) {
    const selectorDiv = document.createElement("div");
    selectorDiv.className = "schedule-type-selector";
    selectorDiv.style.cssText = `
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        `;

    selectorDiv.innerHTML = `
            <h4 style="margin-bottom: 15px; color: #2c3e50;">রুটিন দেখার ধরন নির্বাচন করুন:</h4>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px 15px; border-radius: 8px; transition: all 0.3s; border: 2px solid transparent;">
                    <input type="radio" name="scheduleType" value="classWise" checked style="margin-right: 8px; transform: scale(1.2); accent-color: #4caf50;">
                    <span style="font-weight: 500; color: #2c3e50;">ক্লাস ভিত্তিক রুটিন</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px 15px; border-radius: 8px; transition: all 0.3s; border: 2px solid transparent;">
                    <input type="radio" name="scheduleType" value="teacherWise" style="margin-right: 8px; transform: scale(1.2); accent-color: #4caf50;">
                    <span style="font-weight: 500; color: #2c3e50;">শিক্ষক ভিত্তিক রুটিন</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; padding: 12px 15px; border-radius: 8px; transition: all 0.3s; border: 2px solid transparent;">
                    <input type="radio" name="scheduleType" value="fullSchedule" style="margin-right: 8px; transform: scale(1.2); accent-color: #4caf50;">
                    <span style="font-weight: 500; color: #2c3e50;">সম্পূর্ণ স্কুল রুটিন (একসাথে সব ক্লাস)</span>
                </label>
            </div>
        `;

    // Add hover effects and event listeners
    selectorDiv.querySelectorAll("label").forEach((label) => {
      label.addEventListener("mouseenter", () => {
        label.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
        label.style.borderColor = "#4caf50";
      });
      label.addEventListener("mouseleave", () => {
        const radio = label.querySelector('input[type="radio"]');
        if (!radio.checked) {
          label.style.backgroundColor = "transparent";
          label.style.borderColor = "transparent";
        }
      });

      const radio = label.querySelector('input[type="radio"]');
      radio.addEventListener("change", () => {
        selectorDiv.querySelectorAll("label").forEach((l) => {
          l.style.backgroundColor = "transparent";
          l.style.borderColor = "transparent";
        });
        if (radio.checked) {
          label.style.backgroundColor = "rgba(76, 175, 80, 0.15)";
          label.style.borderColor = "#4caf50";
        }
        this.renderTimetable();
      });

      if (radio.checked) {
        label.style.backgroundColor = "rgba(76, 175, 80, 0.15)";
        label.style.borderColor = "#4caf50";
      }
    });

    container.appendChild(selectorDiv);
  }

  renderClassWiseRoutine(container, classFilter) {
    let classesToDisplay = classFilter
      ? AppState.derivedClasses.filter((c) => c.id === classFilter)
      : AppState.derivedClasses;

    classesToDisplay.forEach((classData) => {
      const classKey = classData.grade.toString();

      // Create class header
      const classHeaderDiv = document.createElement("div");
      classHeaderDiv.style.cssText = `
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
                font-weight: 700;
                font-size: 18px;
            `;
      classHeaderDiv.textContent = `ক্লাস ${classData.grade} - দ্বন্দ্ব মুক্ত রুটিন`;
      container.appendChild(classHeaderDiv);

      // Create professional table
      const table = document.createElement("table");
      table.className = "professional-timetable";

      // Create header
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      // Day/Period header
      const dayPeriodHeader = document.createElement("th");
      dayPeriodHeader.textContent = "দিন/ঘন্টা";
      headerRow.appendChild(dayPeriodHeader);

      // Period headers
      PERIODS.forEach((period, index) => {
        const periodHeader = document.createElement("th");
        periodHeader.className = `period-header ${
          period === "বিরতি" ? "break-header" : ""
        }`;
        periodHeader.innerHTML = `
                    <div>${period}</div>
                    <span class="period-time">${TIME_SLOTS[index]}</span>
                `;
        headerRow.appendChild(periodHeader);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create body
      const tbody = document.createElement("tbody");

      DAYS.forEach((day) => {
        const dayRow = document.createElement("tr");

        // Day cell
        const dayCell = document.createElement("td");
        dayCell.textContent = day;
        dayRow.appendChild(dayCell);

        // Period cells
        PERIODS.forEach((period) => {
          const periodCell = document.createElement("td");
          periodCell.appendChild(
            this.createCompactTimetableCell(classKey, day, period)
          );
          dayRow.appendChild(periodCell);
        });

        tbody.appendChild(dayRow);
      });

      table.appendChild(tbody);
      container.appendChild(table);

      // Add spacing between classes
      const spacer = document.createElement("div");
      spacer.style.height = "40px";
      container.appendChild(spacer);
    });
  }

  renderTeacherWiseRoutine(container, teacherId) {
    const teacher = AppState.teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    // Create teacher header
    const teacherHeaderDiv = document.createElement("div");
    teacherHeaderDiv.style.cssText = `
            background: linear-gradient(135deg, #9b59b6, #8e44ad);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
            font-size: 18px;
        `;
    teacherHeaderDiv.textContent = `শিক্ষক: ${teacher.name} - ${
      teacher.rank || ""
    } (দ্বন্দ্ব মুক্ত)`;
    container.appendChild(teacherHeaderDiv);

    // Create professional table
    const table = document.createElement("table");
    table.className = "professional-timetable";

    // Create header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Day/Period header
    const dayPeriodHeader = document.createElement("th");
    dayPeriodHeader.textContent = "দিন/ঘন্টা";
    headerRow.appendChild(dayPeriodHeader);

    // Period headers
    PERIODS.forEach((period, index) => {
      const periodHeader = document.createElement("th");
      periodHeader.className = `period-header ${
        period === "বিরতি" ? "break-header" : ""
      }`;
      periodHeader.innerHTML = `
                <div>${period}</div>
                <span class="period-time">${TIME_SLOTS[index]}</span>
            `;
      headerRow.appendChild(periodHeader);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement("tbody");

    DAYS.forEach((day) => {
      const dayRow = document.createElement("tr");

      // Day cell
      const dayCell = document.createElement("td");
      dayCell.textContent = day;
      dayRow.appendChild(dayCell);

      // Period cells
      PERIODS.forEach((period) => {
        const periodCell = document.createElement("td");
        periodCell.appendChild(
          this.createCompactTeacherCell(teacher, day, period)
        );
        dayRow.appendChild(periodCell);
      });

      tbody.appendChild(dayRow);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  // Main Full Schedule Renderer - এই function টি আপনার image মতো full school routine দেখাবে
  renderProfessionalFullScheduleView(container) {
    container.style.gridTemplateColumns = "1fr";

    const fullScheduleContainer = document.createElement("div");
    fullScheduleContainer.className = "professional-full-schedule";
    fullScheduleContainer.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border: 2px solid #4caf50;
        `;

    // Header section - Image এর মতো
    const headerSection = document.createElement("div");
    headerSection.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #4caf50; padding-bottom: 15px;">
                <h2 style="color: #2c3e50; font-size: 24px; font-weight: 700; margin-bottom: 5px;">
                    মিরপুর উচ্চ বিদ্যালয় - সম্পূর্ণ রুটিন
                </h2>
                <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                    মিরপুর উচ্চ বিদ্যালয় - নবীনগর, ব্রাহ্মণবাড়িয়া
                </p>
            </div>
        `;
    fullScheduleContainer.appendChild(headerSection);

    // Professional table - Image এর exact layout
    const tableContainer = document.createElement("div");
    tableContainer.style.cssText = `
            overflow-x: auto;
            border-radius: 8px;
            border: 2px solid #333;
        `;

    const table = document.createElement("table");
    table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-family: 'SolaimanLipi', Arial, sans-serif;
            background: white;
            font-size: 12px;
        `;

    // Create header row - Image মতো exact structure
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Days column header
    const dayHeader = document.createElement("th");
    dayHeader.textContent = "দিনসমূহ";
    dayHeader.style.cssText = `
            background: #4472c4;
            color: white;
            padding: 10px 8px;
            text-align: center;
            font-weight: 600;
            border: 1px solid #333;
            font-size: 12px;
            width: 100px;
        `;
    headerRow.appendChild(dayHeader);

    // Period headers with time slots - Image মতো
    PERIODS.forEach((period, index) => {
      const periodHeader = document.createElement("th");
      periodHeader.style.cssText = `
                background: #4472c4;
                color: white;
                padding: 8px 6px;
                text-align: center;
                font-weight: 600;
                border: 1px solid #333;
                font-size: 11px;
                min-width: 110px;
            `;

      if (period === "বিরতি") {
        periodHeader.innerHTML = `
                    <div>বিরতি</div>
                    <div style="font-size: 9px;">${TIME_SLOTS[index]}</div>
                `;
      } else {
        periodHeader.innerHTML = `
                    <div>${period}</div>
                    <div style="font-size: 9px;">${TIME_SLOTS[index]}</div>
                `;
      }

      headerRow.appendChild(periodHeader);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body - Image মতো exact data structure
    const tbody = document.createElement("tbody");

    DAYS.forEach((day) => {
      const dayRow = document.createElement("tr");

      // Day cell - Image মতো styling
      const dayCell = document.createElement("td");
      dayCell.textContent = day;
      dayCell.style.cssText = `
                background: #5b9bd5;
                color: white;
                font-weight: 600;
                text-align: center;
                padding: 12px 8px;
                border: 1px solid #333;
                font-size: 12px;
            `;
      dayRow.appendChild(dayCell);

      // Period cells with exact content like image
      PERIODS.forEach((period) => {
        const periodCell = document.createElement("td");
        periodCell.style.cssText = `
                    padding: 8px 4px;
                    text-align: center;
                    vertical-align: middle;
                    border: 1px solid #333;
                    min-height: 60px;
                    background: white;
                    font-size: 10px;
                `;

        if (period === "বিরতি") {
          periodCell.style.background = "#f0f0f0";
          periodCell.innerHTML = `<div style="font-weight: 600; color: #666;">বিরতি</div>`;
        } else {
          const slots = AppState.timetable.fullSchedule[day]?.[period] || [];

          if (slots.length > 0) {
            // Image মতো multiple class information show করা
            const slotsHtml = slots
              .map((slot) => {
                return `
                                    <div style="
                                        border-bottom: 1px solid #ddd;
                                        padding: 2px 0;
                                        margin: 1px 0;
                                        line-height: 1.1;
                                    ">
                                        <strong>${slot.subject} (${slot.classKey})</strong><br>
                                        <span class="cell-teacher-name-large">${slot.teacher}</span>
                                    </div>
                                `;
              })
              .join("");

            periodCell.innerHTML = slotsHtml;
          } else {
            periodCell.innerHTML = `<div style="color: #999; font-style: italic;">ফাঁকা</div>`;
          }
        }

        dayRow.appendChild(periodCell);
      });

      tbody.appendChild(dayRow);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    fullScheduleContainer.appendChild(tableContainer);
    container.appendChild(fullScheduleContainer);
  }

  createCompactTimetableCell(classKey, day, period) {
    const cellContent = document.createElement("div");
    cellContent.className = "timetable-cell-content";

    if (period === "বিরতি") {
      cellContent.classList.add("break-cell");
      cellContent.innerHTML = '<div class="cell-subject">বিরতি</div>';
    } else {
      const slotData = AppState.timetable.classWise[classKey]?.[day]?.[period];

      if (slotData) {
        cellContent.classList.add("filled");
        const subject = AppState.derivedSubjects.find(
          (s) => s.id === slotData.subjectId
        );

        if (subject) {
          cellContent.style.background = `linear-gradient(135deg, ${subject.color}20, ${subject.color}30)`;
          cellContent.style.borderLeftColor = subject.color;
        }

        cellContent.innerHTML = `
                    <div class="cell-subject">${slotData.subject}</div>
                    <div class="cell-teacher-name-large">${
                      slotData.teacher
                    }</div>
                    <div class="cell-teacher-rank">${
                      slotData.teacherRank || ""
                    }</div>
                    <div class="cell-room">${slotData.room}</div>
                    <div class="cell-day-range">Days: ${
                      slotData.daysPerWeek || 1
                    }/week</div>
                `;
      } else {
        cellContent.classList.add("empty-cell");
        cellContent.innerHTML = '<div class="cell-subject">ফাঁকা</div>';
      }
    }

    return cellContent;
  }

  createCompactTeacherCell(teacher, day, period) {
    const cellContent = document.createElement("div");
    cellContent.className = "timetable-cell-content";

    if (period === "বিরতি") {
      cellContent.classList.add("break-cell");
      cellContent.innerHTML = '<div class="cell-subject">বিরতি</div>';
    } else {
      const slotData =
        AppState.timetable.teacherWise[teacher.id]?.[day]?.[period];

      if (slotData) {
        cellContent.classList.add("filled");
        const subject = AppState.derivedSubjects.find(
          (s) => s.id === slotData.subjectId
        );

        if (subject) {
          cellContent.style.background = `linear-gradient(135deg, ${subject.color}20, ${subject.color}30)`;
          cellContent.style.borderLeftColor = subject.color;
        }

        cellContent.innerHTML = `
                    <div class="cell-subject">${slotData.subject}</div>
                    <div class="cell-teacher">ক্লাস ${slotData.classKey}</div>
                    <div class="cell-room">${slotData.room}</div>
                    <div class="cell-day-range">Days: ${
                      slotData.daysPerWeek || 1
                    }/week</div>
                `;
      } else {
        cellContent.classList.add("empty-cell");
        cellContent.innerHTML = '<div class="cell-subject">ফাঁকা</div>';
      }
    }

    return cellContent;
  }

  performEnhancedConflictAnalysis() {
    const conflictsList = document.getElementById("conflictsList");
    if (!conflictsList) return;

    conflictsList.innerHTML = "";
    const conflicts = this.detectDetailedConflicts();

    if (conflicts.length === 0) {
      conflictsList.innerHTML = `
                <div class="alert alert-success">
                    ✅ সম্পূর্ণ দ্বন্দ্ব মুক্ত রুটিন! 
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>কোনো শিক্ষক একই সময়ে দুটি ক্লাসে নেই</li>
                        <li>প্রতিটি বিষয় নির্ধারিত দিনের রেঞ্জে সঠিকভাবে বিতরণ</li>
                        <li>উন্নত অ্যালগরিদম দিয়ে যাচাইকৃত</li>
                    </ul>
                </div>
            `;
    } else {
      conflictsList.innerHTML = `
                <div class="alert alert-warning" style="margin-bottom: 15px;">
                    <strong>⚠️ মোট ${conflicts.length}টি দ্বন্দ্ব সনাক্ত হয়েছে:</strong>
                </div>
            `;

      conflicts.forEach((conflict) => {
        const conflictItem = document.createElement("div");
        conflictItem.className = "alert alert-danger";
        conflictItem.style.marginBottom = "10px";
        conflictItem.innerHTML = `<strong>দ্বন্দ্ব:</strong> ${conflict}`;
        conflictsList.appendChild(conflictItem);
      });
    }
  }

  detectDetailedConflicts() {
    const conflicts = [];
    const conflictSet = new Set();

    for (const day of DAYS) {
      for (const period of PERIODS.filter((p) => p !== "বিরতি")) {
        const teacherAssignments = new Map();

        Object.keys(AppState.timetable.classWise).forEach((classKey) => {
          const slot = AppState.timetable.classWise[classKey]?.[day]?.[period];
          if (slot) {
            if (teacherAssignments.has(slot.teacherId)) {
              const conflictKey = `teacher-${slot.teacherId}-${day}-${period}`;
              if (!conflictSet.has(conflictKey)) {
                conflicts.push(
                  `শিক্ষক "${
                    slot.teacher
                  }" একই সময়ে দুটি ক্লাসে: ${day}, ${period} (ক্লাস ${teacherAssignments.get(
                    slot.teacherId
                  )} এবং ${classKey})`
                );
                conflictSet.add(conflictKey);
              }
            } else {
              teacherAssignments.set(slot.teacherId, classKey);
            }
          }
        });
      }
    }

    return conflicts;
  }

  filterTimetable() {
    this.renderTimetable();
  }

  setupViewFilters() {
    const viewClassSelect = document.getElementById("viewClass");
    const viewTeacherSelect = document.getElementById("viewTeacher");

    if (viewClassSelect) {
      const currentValue = viewClassSelect.value;
      viewClassSelect.innerHTML = '<option value="">সব ক্লাস</option>';
      AppState.derivedClasses.forEach((cls) => {
        const option = document.createElement("option");
        option.value = cls.id;
        option.textContent = `ক্লাস ${cls.grade}`;
        viewClassSelect.appendChild(option);
      });
      viewClassSelect.value = currentValue;
    }

    if (viewTeacherSelect) {
      const currentValue = viewTeacherSelect.value;
      viewTeacherSelect.innerHTML = '<option value="">সব শিক্ষক</option>';
      AppState.teachers.forEach((teacher) => {
        const option = document.createElement("option");
        option.value = teacher.id;
        option.textContent = `${teacher.name} - ${teacher.rank || ""}`;
        viewTeacherSelect.appendChild(option);
      });
      viewTeacherSelect.value = currentValue;
    }
  }

  setupDropdowns() {
    this.setupViewFilters();
  }

  // এখানে main fix - routine generated হয়েছে কিনা check করার জন্য improved function
  isRoutineGenerated() {
    // Check if any data exists in timetable
    const hasClassWiseData =
      Object.keys(AppState.timetable.classWise).length > 0;
    const hasFullScheduleData =
      Object.keys(AppState.timetable.fullSchedule).length > 0;

    // Also check if there's actual slot data, not just empty objects
    let hasActualData = false;

    if (hasClassWiseData) {
      for (const classKey in AppState.timetable.classWise) {
        for (const day in AppState.timetable.classWise[classKey]) {
          for (const period in AppState.timetable.classWise[classKey][day]) {
            if (AppState.timetable.classWise[classKey][day][period]) {
              hasActualData = true;
              break;
            }
          }
          if (hasActualData) break;
        }
        if (hasActualData) break;
      }
    }

    return hasActualData && (hasClassWiseData || hasFullScheduleData);
  }

  // Enhanced Export functions - এই functions গুলো আপনার requirement অনুযায়ী modify করা হয়েছে
  exportToPDF() {
    if (!this.isRoutineGenerated()) {
      this.showAlert(
        "danger",
        "কোনো রুটিন তৈরি হয়নি। প্রথমে রুটিন তৈরি করুন।"
      );
      return;
    }

    // Generate table format content like the image
    const fullSchoolTableContent = this.generateImageStyleTable();
    let teacherWiseTableContent = "";

    AppState.teachers.forEach((teacher) => {
      teacherWiseTableContent += this.generateTeacherWiseTable(teacher);
    });

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>মিরপুর উচ্চ বিদ্যালয় - সম্পূর্ণ রুটিন</title>
              <style>
                  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap');
                  
                  * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                  }
                  
                  body { 
                      font-family: 'Noto Sans Bengali', Arial, sans-serif; 
                      margin: 15px; 
                      color: #000; 
                      background: white;
                      font-size: 12px;
                  }
                  
                  .header {
                      text-align: center;
                      margin-bottom: 20px;
                      padding: 15px;
                      border-bottom: 2px solid #333;
                  }
                  
                  .header h1 {
                      font-size: 20px;
                      font-weight: 700;
                      margin-bottom: 5px;
                      color: #2c3e50;
                  }
                  
                  .header p {
                      font-size: 14px;
                      color: #666;
                  }
                  
                  .routine-table { 
                      width: 100%; 
                      border-collapse: collapse; 
                      border: 2px solid #333;
                      margin: 10px 0;
                  }
                  
                  .routine-table th, .routine-table td { 
                      border: 1px solid #333; 
                      padding: 8px 6px; 
                      text-align: center; 
                      font-size: 10px; 
                      vertical-align: middle;
                      line-height: 1.2;
                  }
                  
                  .routine-table th { 
                      background: #4472c4; 
                      color: white; 
                      font-weight: 600; 
                      font-size: 9px;
                  }
                  
                  .day-header { 
                      background: #5b9bd5 !important; 
                      color: white !important; 
                      font-weight: 600;
                      font-size: 10px;
                  }
                  
                  .break-cell { 
                      background: #f0f0f0; 
                      color: #666; 
                      font-weight: 600; 
                  }
                  
                  .subject-info {
                      font-size: 9px;
                      line-height: 1.1;
                      margin: 1px 0;
                  }
                  
                  .subject-name {
                      font-weight: 600;
                      color: #2c3e50;
                  }
                  
                  .class-info {
                      color: #3498db;
                      font-weight: 500;
                  }
                  
                  .teacher-info {
                      color: #27ae60;
                      font-size: 8px;
                  }
                  
                  .empty-cell {
                      color: #999;
                      font-style: italic;
                      background: #fafafa;
                  }

                  .teacher-routine-header {
                    text-align: center;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #e0f7fa;
                    border-radius: 8px;
                    border: 1px solid #00bcd4;
                  }
                  .teacher-routine-header h3 {
                    color: #006064;
                    font-size: 16px;
                    font-weight: 600;
                  }
                  
                  @media print { 
                      body { 
                          margin: 8px;
                          font-size: 10px;
                      }
                      .routine-table { 
                          font-size: 8px; 
                      }
                      .routine-table th, .routine-table td {
                          padding: 4px 3px;
                      }
                  }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>মিরপুর উচ্চ বিদ্যালয় - সম্পূর্ণ রুটিন</h1>
                  <p>মিরপুর উচ্চ বিদ্যালয় - নবীনগর, ব্রাহ্মণবাড়িয়া</p>
              </div>
              ${fullSchoolTableContent}
              ${teacherWiseTableContent}
          </body>
          </html>
      `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);

    this.showAlert("success", "সম্পূর্ণ স্কুল রুটিন PDF এক্সপোর্ট প্রস্তুত!");
  }

  generateImageStyleTable() {
    let table = `
      <table class="routine-table">
          <tr>
              <th style="width: 80px;">দিনসমূহ</th>
  `;

    // Header row with periods and time slots
    PERIODS.forEach((period, index) => {
      table += `<th style="width: 120px;">
                  <div>${period}</div>
                  <div style="font-size: 8px; font-weight: 400;">${TIME_SLOTS[index]}</div>
              </th>`;
    });
    table += "</tr>";

    // Data rows for each day
    DAYS.forEach((day) => {
      table += `<tr><td class="day-header">${day}</td>`;

      PERIODS.forEach((period) => {
        if (period === "বিরতি") {
          table += '<td class="break-cell">বিরতি</td>';
        } else {
          // Get all classes data for this day and period
          let cellContent = "";
          let hasContent = false;

          // Loop through all classes to see what's scheduled
          AppState.derivedClasses.forEach((classData) => {
            const classKey = classData.grade.toString();
            const slot =
              AppState.timetable.classWise[classKey]?.[day]?.[period];

            if (slot) {
              hasContent = true;
              cellContent += `<div class="subject-info">
                              <div class="subject-name">${slot.subject}</div>
                              <div class="class-info">(ক্লাস ${classKey})</div>
                              <div class="teacher-info">${slot.teacher}</div>
                            </div>`;
            }
          });

          if (hasContent) {
            table += `<td>${cellContent}</td>`;
          } else {
            table += '<td class="empty-cell">ফাঁকা</td>';
          }
        }
      });
      table += "</tr>";
    });

    table += "</table>";

    // Add detailed summary information
    table += this.generateDetailedSummary();

    return table;
  }

  generateTeacherWiseTable(teacher) {
    let table = `
        <div class="teacher-routine-header">
            <h3>শিক্ষক: ${teacher.name} (${
      teacher.rank || "শিক্ষক"
    }) - রুটিন</h3>
        </div>
        <table class="routine-table">
            <tr>
                <th style="width: 80px;">দিনসমূহ</th>
    `;

    // Header row with periods and time slots
    PERIODS.forEach((period, index) => {
      table += `<th style="width: 120px;">
                    <div>${period}</div>
                    <div style="font-size: 8px; font-weight: 400;">${TIME_SLOTS[index]}</div>
                </th>`;
    });
    table += "</tr>";

    // Data rows for each day
    DAYS.forEach((day) => {
      table += `<tr><td class="day-header">${day}</td>`;

      PERIODS.forEach((period) => {
        if (period === "বিরতি") {
          table += '<td class="break-cell">বিরতি</td>';
        } else {
          const slot =
            AppState.timetable.teacherWise[teacher.id]?.[day]?.[period];

          if (slot) {
            table += `<td>
                                <div class="subject-info">
                                    <div class="subject-name">${slot.subject}</div>
                                    <div class="class-info">(ক্লাস ${slot.classKey})</div>
                                    <div class="teacher-info">${slot.room}</div>
                                </div>
                            </td>`;
          } else {
            table += '<td class="empty-cell">ফাঁকা</td>';
          }
        }
      });
      table += "</tr>";
    });

    table += "</table>";
    return table;
  }

  generateDetailedSummary() {
    let summary = `
      <div style="margin-top: 20px; padding: 15px; border: 1px solid #333; background: #f9f9f9;">
          <h3 style="margin-bottom: 15px; color: #2c3e50; text-align: center;">সারসংক্ষেপ:</h3>
  `;

    // Teacher details with their assignments
    summary +=
      '<div style="margin-bottom: 20px;"><strong>শিক্ষক তালিকা:</strong><br>';
    AppState.teachers.forEach((teacher, index) => {
      summary += `<div style="margin: 8px 0; font-size: 11px;">
                  <strong>${index + 1}. ${teacher.name} (${
        teacher.rank || "শিক্ষক"
      }) - ${teacher.assignments.length} বিষয়</strong><br>
                `;

      teacher.assignments.forEach((assignment, assignIndex) => {
        summary += `<span style="margin-left: 20px; font-size: 10px; color: #666;">
                    ${assignIndex + 1}. ${assignment.subjectName} - ক্লাস ${
          assignment.classGrade
        } - ${assignment.daysPerWeek || 1} দিন/সপ্তাহ
                  </span><br>`;
      });
      summary += "</div>";
    });
    summary += "</div>";

    // Class-wise subject distribution
    summary +=
      '<div style="margin-bottom: 20px;"><strong>ক্লাস ও বিষয় বিতরণ:</strong><br>';
    AppState.derivedClasses.forEach((cls) => {
      const classKey = cls.grade.toString();
      summary += `<div style="margin: 5px 0; font-size: 11px;">
                  <strong>ক্লাস ${cls.grade}:</strong> `;

      const classSubjects = [];
      AppState.teachers.forEach((teacher) => {
        teacher.assignments.forEach((assignment) => {
          if (assignment.classGrade.toString() === classKey) {
            classSubjects.push(`${assignment.subjectName} (${teacher.name})`);
          }
        });
      });

      summary += classSubjects.join(", ");
      summary += "</div>";
    });
    summary += "</div>";

    // Weekly class statistics
    summary +=
      '<div style="margin-bottom: 15px;"><strong>দৈনিক ক্লাস সংখ্যা:</strong><br>';
    DAYS.forEach((day) => {
      let dayClassCount = 0;
      PERIODS.forEach((period) => {
        if (period !== "বিরতি") {
          AppState.derivedClasses.forEach((classData) => {
            const classKey = classData.grade.toString();
            const slot =
              AppState.timetable.classWise[classKey]?.[day]?.[period];
            if (slot) {
              dayClassCount++;
            }
          });
        }
      });
      summary += `<span style="font-size: 10px; margin-right: 15px; display: inline-block; margin-bottom: 5px;">
                  ${day}: ${dayClassCount} ক্লাস
                </span>`;
    });
    summary += "</div>";

    // Generation info
    summary += `
      <div style="text-align: center; margin-top: 15px; padding: 10px; background: #e8f5e8; border-radius: 5px;">
          <div style="font-size: 11px; color: #27ae60; font-weight: 600;">
              দ্বন্দ্ব মুক্ত রুটিন | উন্নত অ্যালগরিদম দ্বারা তৈরি
          </div>
          <div style="font-size: 9px; color: #666; margin-top: 5px;">
              প্রতিবেদন তৈরির তারিখ: ${new Date().toLocaleDateString(
                "bn-BD"
              )} | 
              সময়: ${new Date().toLocaleTimeString("bn-BD")}
          </div>
      </div>
  `;

    summary += "</div>";
    return summary;
  }

  generateSummarySection() {
    let summary = `
      <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; background: #f9f9f9;">
          <h3 style="margin-bottom: 10px; color: #2c3e50;">সারসংক্ষেপ:</h3>
  `;

    // Teacher summary
    summary +=
      '<div style="margin-bottom: 15px;"><strong>শিক্ষক তালিকা:</strong><br>';
    AppState.teachers.forEach((teacher, index) => {
      const totalClasses = teacher.assignments.reduce((total, assignment) => {
        return total + (assignment.daysPerWeek || 1);
      }, 0);

      summary += `<span style="font-size: 10px; margin-right: 15px;">
                  ${index + 1}. ${teacher.name} (${
        teacher.rank || "শিক্ষক"
      }) - ${totalClasses} ক্লাস/সপ্তাহ
                </span>`;

      if ((index + 1) % 2 === 0) summary += "<br>";
    });
    summary += "</div>";

    // Class and subject summary
    summary +=
      '<div style="margin-bottom: 15px;"><strong>ক্লাস ও বিষয় বিতরণ:</strong><br>';
    AppState.derivedClasses.forEach((cls) => {
      const classKey = cls.grade.toString();
      const subjectsCount = AppState.teachers.reduce((count, teacher) => {
        return (
          count +
          teacher.assignments.filter(
            (assignment) => assignment.classGrade.toString() === classKey
          ).length
        );
      }, 0);

      summary += `<span style="font-size: 10px; margin-right: 15px;">
                  ক্লাস ${cls.grade}: ${subjectsCount} বিষয়
                </span>`;
    });
    summary += "</div>";

    // Daily class count
    summary += "<div><strong>দৈনিক ক্লাস সংখ্যা:</strong><br>";
    DAYS.forEach((day) => {
      let dayClassCount = 0;
      PERIODS.forEach((period) => {
        if (period !== "বিরতি") {
          const slots = AppState.timetable.fullSchedule[day]?.[period] || [];
          dayClassCount += slots.length;
        }
      });
      summary += `<span style="font-size: 10px; margin-right: 15px;">
                  ${day}: ${dayClassCount} ক্লাস
                </span>`;
    });
    summary += "</div>";

    summary += `
      </div>
      <div style="text-align: center; margin-top: 15px; font-size: 10px; color: #666;">
          প্রতিবেদন তৈরির তারিখ: ${new Date().toLocaleDateString("bn-BD")} | 
          সময়: ${new Date().toLocaleTimeString("bn-BD")}
      </div>
  `;

    return summary;
  }

  // Image style full routine generator - এটি আপনার দেখানো image এর exact মতো routine তৈরি করবে
  generateImageStyleFullRoutine() {
    let table = `
            <table class="full-routine-table">
                <tr>
                    <th style="width: 100px;">দিনসমূহ</th>
        `;

    // Header row with periods and time slots
    PERIODS.forEach((period, index) => {
      table += `<th style="min-width: 110px;">
                    <div>${period}</div>
                    <div style="font-size: 9px; font-weight: normal;">${TIME_SLOTS[index]}</div>
                </th>`;
    });
    table += "</tr>";

    // Data rows
    DAYS.forEach((day) => {
      table += `<tr><td class="day-header">${day}</td>`;

      PERIODS.forEach((period) => {
        if (period === "বিরতি") {
          table += '<td class="break-cell">বিরতি</td>';
        } else {
          const slots = AppState.timetable.fullSchedule[day]?.[period] || [];

          if (slots.length > 0) {
            const slotsText = slots
              .map(
                (slot) =>
                  `<div class="class-slot">
                   <strong>${slot.subject} (${slot.classKey})</strong><br>
                   <span class="cell-teacher-name-large">${slot.teacher}</span>
                 </div>`
              )
              .join("");
            table += `<td>${slotsText}</td>`;
          } else {
            table += '<td style="color: #999; font-style: italic;">ফাঁকা</td>';
          }
        }
      });
      table += "</tr>";
    });

    table += "</table>";
    return table;
  }

  exportToExcel() {
    if (!this.isRoutineGenerated()) {
      this.showAlert(
        "danger",
        "কোনো রুটিন তৈরি হয়নি। প্রথমে রুটিন তৈরি করুন।"
      );
      return;
    }

    const data = this.generateExcelData();
    const csvContent = this.convertToCSV(data);
    this.downloadFile(
      csvContent,
      `complete-school-routine-${new Date().toISOString().split("T")[0]}.csv`,
      "text/csv"
    );
    this.showAlert("success", "সম্পূর্ণ স্কুল রুটিন CSV ফাইল ডাউনলোড সম্পন্ন!");
  }

  printRoutine() {
    if (!this.isRoutineGenerated()) {
      this.showAlert("danger", "প্রিন্ট করার জন্য কোনো রুটিন নেই।");
      return;
    }

    const fullRoutineContent = this.generateImageStyleFullRoutine();

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>মিরপুর উচ্চ বিদ্যালয় - সম্পূর্ণ স্কুল রুটিন</title>
                <style>
                    body { 
                        font-family: 'SolaimanLipi', Arial, sans-serif; 
                        margin: 15px; 
                        color: #000; 
                        background: white;
                    }
                    .routine-header { 
                        text-align: center; 
                        margin-bottom: 20px; 
                        border-bottom: 3px solid #000; 
                        padding-bottom: 15px; 
                    }
                    .full-routine-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        border: 2px solid #000;
                    }
                    .full-routine-table th, .full-routine-table td { 
                        border: 1px solid #000; 
                        padding: 6px 4px; 
                        text-align: center; 
                        font-size: 10px; 
                    }
                    .full-routine-table th { 
                        background: #ddd; 
                        font-weight: bold; 
                    }
                    .day-header { 
                        background: #eee !important; 
                        font-weight: bold; 
                    }
                    .cell-teacher-name-large {
                        font-size: 11px;
                        font-weight: bold;
                        color: #007bff; /* Example color */
                    }
                    @media print { 
                        body { margin: 10px; }
                        .full-routine-table { font-size: 9px; }
                    }
                </style>
            </head>
            <body>
                <div class="routine-header">
                    <h1>মিরপুর উচ্চ বিদ্যালয় - সম্পূর্ণ রুটিন</h1>
                    <p>মিরপুর উচ্চ বিদ্যালয় - নবীনগর, ব্রাহ্মণবাড়িয়া</p>
                </div>
                ${fullRoutineContent}
            </body>
            </html>
        `);
    printWindow.document.close();
    printWindow.print();
    this.showAlert("success", "প্রিন্ট ডায়ালগ খোলা হয়েছে!");
  }

  generateExcelData() {
    let data = [
      ["মিরপুর উচ্চ বিদ্যালয় - সম্পূর্ণ স্কুল রুটিন"],
      ["নবীনগর, ব্রাহ্মণবাড়িয়া"],
      [""],
    ];

    // Add full schedule data
    const headerRow = ["দিনসমূহ"];
    PERIODS.forEach((period, index) => {
      headerRow.push(`${period} (${TIME_SLOTS[index]})`);
    });
    data.push(headerRow);

    DAYS.forEach((day) => {
      const row = [day];
      PERIODS.forEach((period) => {
        if (period === "বিরতি") {
          row.push("বিরতি");
        } else {
          const slots = AppState.timetable.fullSchedule[day]?.[period] || [];
          if (slots.length > 0) {
            const slotsText = slots
              .map(
                (slot) => `${slot.subject} (${slot.classKey}) - ${slot.teacher}`
              )
              .join(" | ");
            row.push(slotsText);
          } else {
            row.push("ফাঁকা");
          }
        }
      });
      data.push(row);
    });

    return data;
  }

  convertToCSV(data) {
    return data
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" &&
            (cell.includes(",") || cell.includes('"') || cell.includes("\n"))
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(",")
      )
      .join("\n");
  }

  downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  generateReport() {
    const reportType = document.getElementById("reportType")?.value;
    if (!reportType) return;

    let reportContent = this.generateReportContent(reportType);
    const reportPreview = document.getElementById("reportPreview");
    if (reportPreview) {
      reportPreview.innerHTML = reportContent;
    }
  }

  generateReportContent(reportType) {
    switch (reportType) {
      case "teacherWorkload":
        return this.generateTeacherWorkloadReport();
      case "classDistribution":
        return this.generateClassDistributionReport();
      case "weeklyOverview":
        return this.generateWeeklyOverviewReport();
      default:
        return "<p>রিপোর্ট তৈরি হচ্ছে...</p>";
    }
  }

  generateTeacherWorkloadReport() {
    let content = `<div class="report-header"><h3>শিক্ষক কাজের চাপ বিশ্লেষণ</h3></div>`;

    AppState.teachers.forEach((teacher) => {
      let totalDaysPerWeek = 0;
      teacher.assignments.forEach((assignment) => {
        totalDaysPerWeek += assignment.daysPerWeek || 1;
      });

      content += `
                <div class="data-item">
                    <div class="data-info">
                        <strong>${teacher.name}</strong> - ${
        teacher.rank || ""
      }<br>
                        <small>মোট সাপ্তাহিক দিন: ${totalDaysPerWeek}</small><br>
                        <small>বিষয়সমূহ: ${teacher.assignments
                          .map(
                            (a) => `${a.subjectName} (${a.daysPerWeek || 1}d/w)`
                          )
                          .join(", ")}</small>
                    </div>
                </div>
            `;
    });

    return content;
  }

  generateClassDistributionReport() {
    let content = `<div class="report-header"><h3>ক্লাস বিতরণ রিপোর্ট</h3></div>`;

    AppState.derivedClasses.forEach((cls) => {
      const classKey = cls.grade.toString();
      const subjects = [];

      AppState.teachers.forEach((teacher) => {
        teacher.assignments.forEach((assignment) => {
          if (assignment.classGrade.toString() === classKey) {
            subjects.push({
              subject: assignment.subjectName,
              teacher: teacher.name,
              daysPerWeek: assignment.daysPerWeek || 1,
            });
          }
        });
      });

      content += `
                <div class="data-item">
                    <div class="data-info">
                        <strong>ক্লাস ${cls.grade}</strong><br>
                        <small>মোট বিষয়: ${subjects.length}</small><br>
                        <small>বিষয়সমূহ: ${subjects
                          .map((s) => `${s.subject} (${s.daysPerWeek}d/w)`)
                          .join(", ")}</small>
                    </div>
                </div>
            `;
    });

    return content;
  }

  generateWeeklyOverviewReport() {
    let content = `<div class="report-header"><h3>সাপ্তাহিক সংক্ষিপ্ত রিপোর্ট</h3></div>`;

    DAYS.forEach((day) => {
      let dayClasses = 0;
      let dayTeachers = new Set();

      Object.keys(AppState.timetable.classWise).forEach((classKey) => {
        PERIODS.forEach((period) => {
          if (period !== "বিরতি") {
            const slot =
              AppState.timetable.classWise[classKey]?.[day]?.[period];
            if (slot) {
              dayClasses++;
              dayTeachers.add(slot.teacherId);
            }
          }
        });
      });

      content += `
                <div class="data-item">
                    <div class="data-info">
                        <strong>${day}</strong><br>
                        <small>মোট ক্লাস: ${dayClasses}</small><br>
                        <small>সক্রিয় শিক্ষক: ${dayTeachers.size}</small>
                    </div>
                </div>
            `;
    });

    return content;
  }

  showAlert(type, message) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = message;
    alertDiv.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 9999;
            min-width: 350px;
            max-width: 500px;
            padding: 18px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
        `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.animation = "slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => {
        if (alertDiv.parentNode) {
          alertDiv.parentNode.removeChild(alertDiv);
        }
      }, 400);
    }, 5000);
  }

  startAutoSave() {
    setInterval(() => {
      this.saveData();
    }, 30000);
  }
}

// Initialize the Application
let app;
document.addEventListener("DOMContentLoaded", function () {
  app = new AdvancedSchoolRoutineApp();
  app.startAutoSave();
});

// Global functions for backwards compatibility
window.app = app;
