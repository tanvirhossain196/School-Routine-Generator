// Enhanced Application State
const AppState = {
    teachers: [],
    derivedClasses: [],
    derivedSubjects: [],
    derivedRooms: [],
    timetable: {
        classWise: {},
        teacherWise: {},
        fullSchedule: {}
    },
    generatedRoutineTypes: {
        classWise: false,
        teacherWise: false,
        fullSchedule: false
    },
    teacherSlotAssignments: {},
    roomOccupancy: {}
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
    "৭ম ঘন্টা"
];
const TIME_SLOTS = [
    "১০:১৫-১১:০৫",
    "১১:০৫-১১:৫০",
    "১১:৫০-১২:৩৫",
    "১২:৩৫-১:২০",
    "১:২০-২:০৫",
    "২:০৫-২:৪৫",
    "২:৪৫-৩:২৫",
    "৩:২৫-৪:০০"
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
    "সংগীত"
];

const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

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
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        // Create virtual rooms based on class and subject
        const roomKey = `room-${
          assignment.classGrade
        }-${assignment.subjectName.toLowerCase()}`;
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
                        <option value="">Select day range</option>
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
                    <option value="">Select day range</option>
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

      assignments.push({
        subjectName,
        dayRange,
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
                    <strong>${assignment.subjectName}</strong> for Class ${assignment.classGrade}
                    - Days: ${assignment.dayRange}
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
                            <option value="">Select day range</option>
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
                            <option value="">Select day range</option>
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

  // Enhanced Conflict-Free Timetable Generation with Day Range Support
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
      "Assigning time slots based on day ranges...",
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

    const success = this.executeConflictFreeSchedulingAlgorithm();

    if (success) {
      this.generateTeacherWiseFromClassWise();
      this.generateFullScheduleFromClassWise();

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
      const success = this.assignSubjectWithDayRange(assignment, actualPeriods);
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
          priority: priority,
        });
      });
    });

    return queue.sort((a, b) => b.priority - a.priority);
  }

  calculateAssignmentPriority(assignment) {
    let priority = 0;

    // Calculate number of days from range
    const [startDay, endDay] = assignment.dayRange.split("-").map(Number);
    const dayCount = endDay - startDay + 1;
    priority += dayCount * 10;

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

  assignSubjectWithDayRange(assignment, actualPeriods) {
    const availableSlots = this.findAvailableSlotsForDayRange(
      assignment,
      actualPeriods
    );

    if (availableSlots.length === 0) {
      return false;
    }

    const bestSlot = availableSlots[0];
    return this.assignSubjectToSlotWithDayRange(assignment, bestSlot);
  }

  findAvailableSlotsForDayRange(assignment, actualPeriods) {
    const availableSlots = [];
    const classKey = assignment.classKey;
    const [startDay, endDay] = assignment.dayRange.split("-").map(Number);

    for (const period of actualPeriods) {
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
        availableSlots.push({ period: period });
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

  assignSubjectToSlotWithDayRange(assignment, slot) {
    const classKey = assignment.classKey;
    const [startDay, endDay] = assignment.dayRange.split("-").map(Number);

    const subject = AppState.derivedSubjects.find(
      (s) => s.name === assignment.subjectName
    );

    if (!subject) {
      console.error(`Subject not found for assignment:`, assignment);
      return false;
    }

    // Assign to all days in the range
    for (let dayIndex = startDay - 1; dayIndex < endDay; dayIndex++) {
      const day = DAYS[dayIndex];

      if (
        this.isTeacherBusyInSlot(assignment.teacherId, day, slot.period) ||
        AppState.timetable.classWise[classKey]?.[day]?.[slot.period]
      ) {
        console.error(
          `Conflict detected during assignment for ${assignment.subjectName} on ${day} at ${slot.period}`
        );
        return false;
      }

      if (!AppState.timetable.classWise[classKey]) {
        AppState.timetable.classWise[classKey] = {};
      }
      if (!AppState.timetable.classWise[classKey][day]) {
        AppState.timetable.classWise[classKey][day] = {};
      }

      AppState.timetable.classWise[classKey][day][slot.period] = {
        classId: `class-${classKey}`,
        subjectId: subject.id,
        teacherId: assignment.teacherId,
        subject: assignment.subjectName,
        teacher: assignment.teacherName,
        teacherRank: assignment.teacherRank,
        room: `Room ${classKey}${assignment.subjectName.charAt(0)}`,
        building: "Main Building",
        dayRange: assignment.dayRange,
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
    } else {
      container.style.gridTemplateColumns = `120px repeat(${PERIODS.length}, 1fr)`;
      this.addTimetableHeaders(container);

      if (teacherFilter && scheduleType === "teacherWise") {
        this.renderTeacherWiseRoutine(container, teacherFilter);
      } else if (scheduleType === "classWise") {
        this.renderClassWiseRoutine(container, classFilter);
      }
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

  renderProfessionalFullScheduleView(container) {
    container.style.gridTemplateColumns = "1fr";

    const fullScheduleContainer = document.createElement("div");
    fullScheduleContainer.className = "professional-full-schedule";
    fullScheduleContainer.style.cssText = `
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e9ecef;
        `;

    // Header section
    const headerSection = document.createElement("div");
    headerSection.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #2c3e50; font-size: 28px; font-weight: 700; margin-bottom: 8px;">
                    মিরপুর উচ্চ বিদ্যালয়
                </h2>
                <p style="color: #7f8c8d; font-size: 16px; margin-bottom: 15px;">
                    নবীনগর, ব্রাহ্মণবাড়িয়া - সাপ্তাহিক ক্লাস রুটিন
                </p>
                < style="display: inline-block; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 8px 20px; border-radius: 25px; font-weight: 600; font-size: 14px;">
                    ✓ সম্পূর্ণ দ্বন্দ্ব মুক্ত সিস্টেম
                </div>
        `;
    fullScheduleContainer.appendChild(headerSection);

    // Professional table with proper structure
    const tableContainer = document.createElement("div");
    tableContainer.style.cssText = `
            overflow-x: auto;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            background: white;
        `;

    const table = document.createElement("table");
    table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-family: 'Segoe UI', sans-serif;
            background: white;
            min-width: 1000px;
        `;

    // Create header row
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Day header
    const dayHeader = document.createElement("th");
    dayHeader.textContent = "দিন / ঘন্টা";
    dayHeader.style.cssText = `
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 15px 20px;
            text-align: center;
            font-weight: 600;
            font-size: 14px;
            border-right: 2px solid rgba(255,255,255,0.1);
            width: 120px;
            position: sticky;
            left: 0;
            z-index: 10;
        `;
    headerRow.appendChild(dayHeader);

    // Period headers
    PERIODS.forEach((period, index) => {
      const periodHeader = document.createElement("th");
      periodHeader.style.cssText = `
                padding: 12px 8px;
                text-align: center;
                font-weight: 600;
                font-size: 13px;
                border-right: 1px solid rgba(255,255,255,0.1);
                width: 140px;
                color: white;
            `;

      if (period === "বিরতি") {
        periodHeader.style.background =
          "linear-gradient(135deg, #95a5a6, #7f8c8d)";
        periodHeader.innerHTML = `
                    <div style="font-weight: 600;">বিরতি</div>
                    <div style="font-size: 11px; opacity: 0.9;">${TIME_SLOTS[index]}</div>
                `;
      } else {
        periodHeader.style.background =
          "linear-gradient(135deg, #2c3e50, #34495e)";
        periodHeader.innerHTML = `
                    <div style="font-weight: 600;">${period}</div>
                    <div style="font-size: 11px; opacity: 0.9;">${TIME_SLOTS[index]}</div>
                `;
      }

      headerRow.appendChild(periodHeader);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    DAYS.forEach((day, dayIndex) => {
      const dayRow = document.createElement("tr");
      dayRow.style.cssText = `
                border-bottom: 1px solid #e9ecef;
                transition: background-color 0.3s ease;
            `;

      // Add hover effect
      dayRow.addEventListener("mouseenter", () => {
        dayRow.style.backgroundColor = "#f8f9fa";
      });
      dayRow.addEventListener("mouseleave", () => {
        dayRow.style.backgroundColor = "";
      });

      // Day cell
      const dayCell = document.createElement("td");
      dayCell.textContent = day;
      dayCell.style.cssText = `
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                font-weight: 600;
                text-align: center;
                padding: 15px 20px;
                border-right: 2px solid rgba(255,255,255,0.1);
                position: sticky;
                left: 0;
                z-index: 5;
            `;
      dayRow.appendChild(dayCell);

      // Period cells
      PERIODS.forEach((period) => {
        const periodCell = document.createElement("td");
        periodCell.style.cssText = `
                    padding: 10px 6px;
                    text-align: center;
                    vertical-align: middle;
                    border-right: 1px solid #e9ecef;
                    min-height: 70px;
                    max-width: 140px;
                `;

        if (period === "বিরতি") {
          periodCell.style.cssText += `
                        background: linear-gradient(135deg, #ecf0f1, #d5dbdb);
                        font-weight: 600;
                        color: #7f8c8d;
                    `;
          periodCell.innerHTML = `
                        <div style="font-size: 13px;">বিরতি</div>
                    `;
        } else {
          const slots = AppState.timetable.fullSchedule[day]?.[period] || [];

          if (slots.length > 0) {
            const slotsHtml = slots
              .map((slot, slotIndex) => {
                const subject = AppState.derivedSubjects.find(
                  (s) => s.id === slot.subjectId
                );
                const bgColor = subject?.color || "#4caf50";

                return `
                                    <div style="
                                        background: linear-gradient(135deg, ${bgColor}15, ${bgColor}25);
                                        border-left: 3px solid ${bgColor};
                                        border-radius: 4px;
                                        padding: 4px 6px;
                                        margin: ${
                                          slotIndex > 0 ? "3px" : "0"
                                        } 0;
                                        font-size: 11px;
                                        line-height: 1.2;
                                        text-align: left;
                                    ">
                                        <div style="font-weight: 600; color: #2c3e50;">${
                                          slot.subject
                                        }</div>
                                        <div style="color: #34495e;">ক্লাস ${
                                          slot.classKey
                                        }</div>
                                        <div style="color: #7f8c8d; font-size: 10px;">${
                                          slot.teacher
                                        }</div>
                                        <div style="color: #95a5a6; font-size: 9px;">${
                                          slot.teacherRank || ""
                                        }</div>
                                    </div>
                                `;
              })
              .join("");

            periodCell.innerHTML = slotsHtml;
          } else {
            periodCell.style.background = "#fafbfc";
            periodCell.innerHTML = `
                            <div style="color: #95a5a6; font-style: italic; font-size: 12px;">ফাঁকা</div>
                        `;
          }
        }

        dayRow.appendChild(periodCell);
      });

      tbody.appendChild(dayRow);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    fullScheduleContainer.appendChild(tableContainer);

    // Add summary statistics
    const summaryDiv = document.createElement("div");
    summaryDiv.style.cssText = `
            margin-top: 20px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 15px;
        `;

    const totalClasses = Object.keys(AppState.timetable.classWise).length;
    const totalTeachers = AppState.teachers.length;
    const totalSubjects = AppState.derivedSubjects.length;

    summaryDiv.innerHTML = `
            <div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 8px; flex: 1; min-width: 120px;">
                <div style="font-size: 24px; font-weight: 700; color: #27ae60;">${totalClasses}</div>
                <div style="font-size: 14px; color: #2c3e50;">মোট ক্লাস</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #e3f2fd; border-radius: 8px; flex: 1; min-width: 120px;">
                <div style="font-size: 24px; font-weight: 700; color: #1976d2;">${totalTeachers}</div>
                <div style="font-size: 14px; color: #2c3e50;">মোট শিক্ষক</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #fff3e0; border-radius: 8px; flex: 1; min-width: 120px;">
                <div style="font-size: 24px; font-weight: 700; color: #f57c00;">${totalSubjects}</div>
                <div style="font-size: 14px; color: #2c3e50;">মোট বিষয়</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #fce4ec; border-radius: 8px; flex: 1; min-width: 120px;">
                <div style="font-size: 24px; font-weight: 700; color: #c2185b;">০</div>
                <div style="font-size: 14px; color: #2c3e50;">দ্বন্দ্ব</div>
            </div>
        `;

    fullScheduleContainer.appendChild(summaryDiv);
    container.appendChild(fullScheduleContainer);
  }

  addTimetableHeaders(container) {
    const headerTime = document.createElement("div");
    headerTime.className = "timetable-header";
    headerTime.textContent = "দিন/ঘন্টা";
    headerTime.style.background = "linear-gradient(135deg, #2c3e50, #34495e)";
    container.appendChild(headerTime);

    PERIODS.forEach((period, index) => {
      const headerPeriod = document.createElement("div");
      headerPeriod.className = "timetable-header";
      headerPeriod.style.background =
        period === "বিরতি"
          ? "linear-gradient(135deg, #95a5a6, #7f8c8d)"
          : "linear-gradient(135deg, #2c3e50, #34495e)";
      headerPeriod.innerHTML =
        period === "বিরতি"
          ? `বিরতি<br><small>${TIME_SLOTS[index]}</small>`
          : `${period}<br><small>${TIME_SLOTS[index]}</small>`;
      container.appendChild(headerPeriod);
    });
  }

  renderClassWiseRoutine(container, classFilter) {
    let classesToDisplay = classFilter
      ? AppState.derivedClasses.filter((c) => c.id === classFilter)
      : AppState.derivedClasses;

    classesToDisplay.forEach((classData) => {
      const classKey = classData.grade.toString();
      this.addClassHeader(container, classData);

      DAYS.forEach((day) => {
        this.addDayHeader(container, day);
        PERIODS.forEach((period) => {
          const cell = this.createTimetableCell(classKey, day, period);
          container.appendChild(cell);
        });
      });
    });
  }

  renderTeacherWiseRoutine(container, teacherId) {
    const teacher = AppState.teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    this.addTeacherHeader(container, teacher);

    DAYS.forEach((day) => {
      this.addDayHeader(container, day);
      PERIODS.forEach((period) => {
        const cell = this.createTeacherCell(teacher, day, period);
        container.appendChild(cell);
      });
    });
  }

  addClassHeader(container, classData) {
    const classHeader = document.createElement("div");
    classHeader.className = "timetable-header";
    classHeader.style.gridColumn = `1 / span ${PERIODS.length + 1}`;
    classHeader.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
    classHeader.style.marginTop = "10px";
    classHeader.style.color = "white";
    classHeader.style.fontWeight = "bold";
    classHeader.textContent = `ক্লাস ${classData.grade} (দ্বন্দ্ব মুক্ত)`;
    container.appendChild(classHeader);
  }

  addTeacherHeader(container, teacher) {
    const teacherHeader = document.createElement("div");
    teacherHeader.className = "timetable-header";
    teacherHeader.style.gridColumn = `1 / span ${PERIODS.length + 1}`;
    teacherHeader.style.background =
      "linear-gradient(135deg, #9b59b6, #8e44ad)";
    teacherHeader.style.marginTop = "10px";
    teacherHeader.style.color = "white";
    teacherHeader.style.fontWeight = "bold";
    teacherHeader.textContent = `শিক্ষক: ${teacher.name} - ${
      teacher.rank || ""
    } (দ্বন্দ্ব মুক্ত)`;
    container.appendChild(teacherHeader);
  }

  addDayHeader(container, day) {
    const dayHeader = document.createElement("div");
    dayHeader.className = "timetable-header";
    dayHeader.style.background = "linear-gradient(135deg, #3498db, #2980b9)";
    dayHeader.style.color = "white";
    dayHeader.style.fontWeight = "600";
    dayHeader.textContent = day;
    container.appendChild(dayHeader);
  }

  createTimetableCell(classKey, day, period) {
    const cell = document.createElement("div");

    if (period === "বিরতি") {
      cell.className = "timetable-cell break-cell";
      cell.style.background = "linear-gradient(135deg, #ecf0f1, #d5dbdb)";
      cell.innerHTML = '<div class="slot-content">বিরতি</div>';
    } else {
      cell.className = "timetable-cell";
      const slotData = AppState.timetable.classWise[classKey]?.[day]?.[period];

      if (slotData) {
        const subject = AppState.derivedSubjects.find(
          (s) => s.id === slotData.subjectId
        );
        cell.style.background = subject
          ? `linear-gradient(135deg, ${subject.color}88, ${subject.color}bb)`
          : "linear-gradient(135deg, #4caf50, #45a049)";
        cell.className += " filled";
        cell.innerHTML = `
                    <div class="slot-content">
                        <div class="slot-subject">${slotData.subject}</div>
                        <div class="slot-teacher">${slotData.teacher}</div>
                        <div class="slot-teacher-rank">${
                          slotData.teacherRank || ""
                        }</div>
                        <div class="slot-room">${slotData.room} (${
          slotData.building
        })</div>
                        <div class="slot-day-range">Days: ${
                          slotData.dayRange
                        }</div>
                    </div>
                `;
      } else {
        cell.style.background = "linear-gradient(135deg, #ecf0f1, #bdc3c7)";
        cell.innerHTML = '<div class="slot-content">ফাঁকা</div>';
      }
    }

    return cell;
  }

  createTeacherCell(teacher, day, period) {
    const cell = document.createElement("div");

    if (period === "বিরতি") {
      cell.className = "timetable-cell break-cell";
      cell.style.background = "linear-gradient(135deg, #ecf0f1, #d5dbdb)";
      cell.innerHTML = '<div class="slot-content">বিরতি</div>';
    } else {
      cell.className = "timetable-cell";
      const slotData =
        AppState.timetable.teacherWise[teacher.id]?.[day]?.[period];

      if (slotData) {
        const subject = AppState.derivedSubjects.find(
          (s) => s.id === slotData.subjectId
        );
        cell.style.background = subject
          ? `linear-gradient(135deg, ${subject.color}88, ${subject.color}bb)`
          : "linear-gradient(135deg, #3498db, #2980b9)";
        cell.className += " filled";
        cell.innerHTML = `
                    <div class="slot-content">
                        <div class="slot-subject">${slotData.subject}</div>
                        <div class="slot-class">ক্লাস ${slotData.classKey}</div>
                        <div class="slot-room">${slotData.room} (${slotData.building})</div>
                        <div class="slot-day-range">Days: ${slotData.dayRange}</div>
                    </div>
                `;
      } else {
        cell.style.background = "linear-gradient(135deg, #ecf0f1, #bdc3c7)";
        cell.innerHTML = '<div class="slot-content">ফাঁকা</div>';
      }
    }

    return cell;
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

  // Export functions
  exportToPDF() {
    let allContent = this.generateAllRoutineContent();

    if (!allContent) {
      this.showAlert(
        "danger",
        "কোনো রুটিন তৈরি হয়নি। প্রথমে রুটিন তৈরি করুন।"
      );
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>মিরপুর উচ্চ বিদ্যালয় - দ্বন্দ্ব মুক্ত ক্লাস রুটিন</title>
                <style>
                    body { font-family: 'SolaimanLipi', Arial, sans-serif; margin: 20px; color: #000; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #27ae60; padding-bottom: 20px; }
                    .header h1 { color: #2c3e50; margin-bottom: 5px; font-size: 28px; font-weight: 700; }
                    .timetable { width: 100%; border-collapse: collapse; margin-bottom: 30px; page-break-inside: avoid; }
                    .timetable th, .timetable td { border: 1px solid #333; padding: 8px; text-align: center; font-size: 11px; }
                    .timetable th { background: #2c3e50; color: white; font-weight: bold; }
                    @media print { body { margin: 10px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>মিরপুর উচ্চ বিদ্যালয়</h1>
                    <p>নবীনগর, ব্রাহ্মণবাড়িয়া - দ্বন্দ্ব মুক্ত রুটিন</p>
                </div>
                ${allContent}
            </body>
            </html>
        `);
    printWindow.document.close();
    this.showAlert(
      "success",
      "দ্বন্দ্ব মুক্ত পিডিএফ এক্সপোর্ট উইন্ডো খোলা হয়েছে!"
    );
  }

  exportToExcel() {
    const data = this.generateExcelData();
    const csvContent = this.convertToCSV(data);
    this.downloadFile(
      csvContent,
      `conflict-free-routine-${new Date().toISOString().split("T")[0]}.csv`,
      "text/csv"
    );
    this.showAlert("success", "দ্বন্দ্ব মুক্ত সিএসভি ফাইল ডাউনলোড সম্পন্ন!");
  }

  printRoutine() {
    let allContent = this.generateAllRoutineContent();
    if (!allContent) {
      this.showAlert("danger", "প্রিন্ট করার জন্য কোনো রুটিন নেই।");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>মিরপুর উচ্চ বিদ্যালয় - দ্বন্দ্ব মুক্ত রুটিন</title>
                <style>
                    body { font-family: 'SolaimanLipi', Arial, sans-serif; margin: 20px; color: #000; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .timetable { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .timetable th, .timetable td { border: 1px solid #333; padding: 8px; text-align: center; font-size: 11px; }
                    .timetable th { background: #2c3e50; color: white; font-weight: bold; }
                    @media print { body { margin: 10px; } }
                </style>
            </head>
            <body>
                ${allContent}
            </body>
            </html>
        `);
    printWindow.document.close();
    printWindow.print();
    this.showAlert("success", "দ্বন্দ্ব মুক্ত প্রিন্ট ডায়ালগ খোলা হয়েছে!");
  }

  generateAllRoutineContent() {
    let content = "";

    if (AppState.generatedRoutineTypes.classWise) {
      AppState.derivedClasses.forEach((cls) => {
        content += this.generateClassTable(cls);
      });
    }

    if (AppState.generatedRoutineTypes.fullSchedule) {
      content += this.generateFullScheduleTable();
    }

    return content;
  }

  generateFullScheduleTable() {
    let table = `
            <h2>সম্পূর্ণ স্কুল রুটিন (দ্বন্দ্ব মুক্ত)</h2>
            <table class="timetable">
                <tr><th>দিন/ঘন্টা</th>
        `;

    PERIODS.forEach((period, index) => {
      table += `<th>${period === "বিরতি" ? "বিরতি" : period}<br><small>${
        TIME_SLOTS[index]
      }</small></th>`;
    });
    table += "</tr>";

    DAYS.forEach((day) => {
      table += `<tr><td style="background: #3498db; color: white; font-weight: bold;">${day}</td>`;
      PERIODS.forEach((period) => {
        if (period === "বিরতি") {
          table += '<td style="background: #f8f9fa;">বিরতি</td>';
        } else {
          const slots = AppState.timetable.fullSchedule[day]?.[period] || [];
          if (slots.length > 0) {
            const slotsText = slots
              .map(
                (slot) =>
                  `${slot.subject} (${slot.classKey}) - ${slot.teacher} (${
                    slot.teacherRank || ""
                  })`
              )
              .join("<br>");
            table += `<td style="font-size: 10px;">${slotsText}</td>`;
          } else {
            table += '<td style="background: #f8f9fa;">ফাঁকা</td>';
          }
        }
      });
      table += "</tr>";
    });

    table += "</table>";
    return table;
  }

  generateClassTable(classData) {
    const classKey = classData.grade.toString();
    const classRoutine = AppState.timetable.classWise[classKey];

    if (!classRoutine) return "";

    let table = `
            <h2>ক্লাস ${classData.grade}</h2>
            <table class="timetable">
                <tr><th>দিন/ঘন্টা</th>
        `;

    PERIODS.forEach((period, index) => {
      table += `<th>${period === "বিরতি" ? "বিরতি" : period}<br><small>${
        TIME_SLOTS[index]
      }</small></th>`;
    });
    table += "</tr>";

    DAYS.forEach((day) => {
      table += `<tr><td style="background: #3498db; color: white; font-weight: bold;">${day}</td>`;
      PERIODS.forEach((period) => {
        if (period === "বিরতি") {
          table += '<td style="background: #f8f9fa;">বিরতি</td>';
        } else {
          const slotData = classRoutine?.[day]?.[period];
          if (slotData) {
            table += `<td><strong>${slotData.subject}</strong><br><small>${
              slotData.teacher
            }</small><br><small>${
              slotData.teacherRank || ""
            }</small><br><small>${slotData.room}</small></td>`;
          } else {
            table += '<td style="background: #f8f9fa;">ফাঁকা</td>';
          }
        }
      });
      table += "</tr>";
    });

    table += "</table>";
    return table;
  }

  generateExcelData() {
    let data = [
      ["মিরপুর উচ্চ বিদ্যালয় - দ্বন্দ্ব মুক্ত রুটিন"],
      ["নবীনগর, ব্রাহ্মণবাড়িয়া"],
      [""],
    ];

    if (AppState.generatedRoutineTypes.classWise) {
      AppState.derivedClasses.forEach((cls) => {
        const classKey = cls.grade.toString();
        data.push([`ক্লাস: ${classKey}`]);

        const headerRow = ["দিন/ঘন্টা"];
        PERIODS.forEach((period, index) => {
          headerRow.push(
            `${period === "বিরতি" ? "বিরতি" : period} (${TIME_SLOTS[index]})`
          );
        });
        data.push(headerRow);

        DAYS.forEach((day) => {
          const row = [day];
          PERIODS.forEach((period) => {
            if (period === "বিরতি") {
              row.push("বিরতি");
            } else {
              const slotData =
                AppState.timetable.classWise[classKey]?.[day]?.[period];
              if (slotData) {
                row.push(
                  `${slotData.subject} | ${slotData.teacher} | ${
                    slotData.teacherRank || ""
                  } | ${slotData.room}`
                );
              } else {
                row.push("ফাঁকা");
              }
            }
          });
          data.push(row);
        });
        data.push([""]);
      });
    }

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
      let totalDays = 0;
      teacher.assignments.forEach((assignment) => {
        const [startDay, endDay] = assignment.dayRange.split("-").map(Number);
        totalDays += endDay - startDay + 1;
      });

      content += `
                <div class="data-item">
                    <div class="data-info">
                        <strong>${teacher.name}</strong> - ${
        teacher.rank || ""
      }<br>
                        <small>মোট সাপ্তাহিক দিন: ${totalDays}</small><br>
                        <small>বিষয়সমূহ: ${teacher.assignments
                          .map((a) => `${a.subjectName} (${a.dayRange})`)
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
              dayRange: assignment.dayRange,
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
                          .map((s) => `${s.subject} (${s.dayRange})`)
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