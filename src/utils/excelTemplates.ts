/**
 * Excel / CSV Sample Template Generator & Parser
 * Complies with Statutory Accreditation Ledgers (AISHE, DTE, MSBTE CIAAN-2023, PCI ER-2020)
 */

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadStudentTemplate() {
  const headers = 'RollNo,Name,PRN_EnrollmentNo,Division,Batch,AttendanceTheoryPct,AttendancePracticalPct,Sessional1Marks,ContinuousAssessment';
  const sampleRows = [
    '01,Aarav Sharma,PRN2025001,A,Batch B1,88,92,26,24',
    '02,Diya Patel,PRN2025002,A,Batch B1,94,96,28,25',
    '03,Rohan Kulkarni,PRN2025003,A,Batch B1,68,70,18,18',
    '04,Ananya Iyer,PRN2025004,A,Batch B1,90,92,27,24',
    '05,Siddharth Rao,PRN2025005,A,Batch B2,72,74,21,19',
    '06,Pooja Jadhav,PRN2025006,A,Batch B2,84,86,24,22',
  ];
  const csv = [headers, ...sampleRows].join('\n');
  downloadCSV('Student_Master_Template.csv', csv);
}

export function downloadFacultyTemplate() {
  const headers = 'EmpCode,Name,Department,Designation,Role,WeeklyPrescribedHours,ContactEmail';
  const sampleRows = [
    'EMP-101,Dr. Rajesh Sharma,Department of Pharmacy,Professor & HOD,HOD,14,rajesh.sharma@inst.edu',
    'EMP-102,Prof. Ananya Deshmukh,Department of Pharmacy,Assistant Professor,FACULTY,16,ananya.d@inst.edu',
    'EMP-103,Prof. Vikram Patil,Department of Pharmacy,Assistant Professor,FACULTY,16,vikram.p@inst.edu',
    'EMP-104,Dr. Sunita Mehta,Department of Pharmacy,Associate Professor,FACULTY,16,sunita.m@inst.edu',
  ];
  const csv = [headers, ...sampleRows].join('\n');
  downloadCSV('Faculty_Master_Template.csv', csv);
}

export function downloadSubjectTemplate() {
  const headers = 'SubjectCode,SubjectTitle,Programme,Semester,PrescribedTheoryHours,PrescribedPracticalHours';
  const sampleRows = [
    '20111,Pharmaceutics-I,Diploma in Pharmacy (D.Pharm),Year 1,75,75',
    '20112,Pharmaceutical Chemistry-I,Diploma in Pharmacy (D.Pharm),Year 1,75,75',
    '20113,Pharmacognosy,Diploma in Pharmacy (D.Pharm),Year 1,75,75',
    '20114,Human Anatomy & Physiology,Diploma in Pharmacy (D.Pharm),Year 1,75,50',
    '20115,Social Pharmacy,Diploma in Pharmacy (D.Pharm),Year 1,75,0',
  ];
  const csv = [headers, ...sampleRows].join('\n');
  downloadCSV('Subject_Master_Curriculum_Template.csv', csv);
}

export function parseCSV(text: string): Array<Record<string, string>> {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const results: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx];
      });
      results.push(row);
    }
  }

  return results;
}
