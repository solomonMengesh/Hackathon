import UserModel from '../Models/UserModel.js';
import Application from '../Models/Application.js';
import AdvisorAssignment from '../Mpost.model.js';


exports.assignAdvisor = async (req, res) => {
  try {
    const { advisorId, userId, AdminId, startDate, endDate } = req.body;

    if (!advisorId || !userId || !AdminId || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const advisor = await UserModel.findById(advisorId);
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    }

    const application = await Application.findOne({ applicantId: userId, status: 'approved' });
    if (!application) {
      return res.status(404).json({ message: 'Approved application not found for this student' });
    }

    const existingAssignment = await AdvisorAssignment.findOne({ studentId: userId });
    if (existingAssignment) {
      return res.status(409).json({ message: 'Advisor already assigned to this student' });
    }

    const assignment = new AdvisorAssignment({
      AdvisorId: advisor._id,
      advisorName: advisor.userName,
      advisorEmail: advisor.email,
      advisorstatus: advisor.status,
      studentId: userId,
      studentName: application.firstName + ' ' + application.lastName,
      companyName: application.university,
      studentStatus: application.status,
      assignedBy: AdminId,
      assign: true,
      startDate,
      endDate,
    });

    await assignment.save();

    res.status(200).json({ message: 'Advisor assigned successfully', assignment });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ message: 'Server error while assigning advisor' });
  }
};

// DELETE an assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { studentId } = req.body;

    const deleted = await AdvisorAssignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Assignment not found' });

    if (studentId) {
      await Application.updateMany({ applicantId: studentId }, { assign: false });
    }

    res.status(200).json({ message: 'Assignment and related application updated' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Failed to delete assignment' });
  }
};

// UPDATE an assignment
export const updateAssignment = async (req, res) => {
  try {
    const { studentEmail, advisorEmail } = req.body;

    // Get advisor from UserModel
    const advisor = await UserModel.findOne({ email: advisorEmail, role: 'advisor', status: 'approved' });
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found or not approved' });
    }

    // Get student info from ApplicationModel
    const application = await Application.findOne({ email: studentEmail, status: 'approved' });
    if (!application) {
      return res.status(404).json({ message: 'Approved application for student not found' });
    }

    const updated = await AdvisorAssignment.findByIdAndUpdate(
      req.params.id,
      {
        studentId: application.applicantId,
        studentName: application.name,
        studentEmail: application.email,
        studentStatus: application.status,
        advisorId: advisor._id,
        advisorName: advisor.name,
        advisorEmail: advisor.email,
        advisorstatus: advisor.status,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Failed to update assignment' });
  }
};
