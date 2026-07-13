const Issue = require('../models/Issue');

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const photoURL = req.file ? `/uploads/${req.file.filename}` : null;

    const issue = new Issue({
      title,
      description,
      category,
      location,
      photoURL,
      reporter: req.user.id
    });
    
    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create issue' });
  }
};

exports.getIssues = async (req, res) => {
  try {
    let issues;
    if (req.user.role === 'admin') {
      issues = await Issue.find().populate('reporter', 'name email').sort({ createdAt: -1 });
    } else {
      issues = await Issue.find({ reporter: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('reporter', 'name email');
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    
    // Only the reporter should add feedback
    if (issue.reporter.toString() !== req.user.id) {
       return res.status(403).json({ error: 'Unauthorized to add feedback to this issue' });
    }

    issue.feedback = feedback;
    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add feedback' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });
    const pendingIssues = await Issue.countDocuments({ status: 'Pending' });
    const inProgressIssues = await Issue.countDocuments({ status: 'In Progress' });
    
    // Calculate simple resolution time if needed (mocked/simplified for now)
    const avgResolutionTime = '24h'; // You could calculate real difference if needed

    res.json({
      totalIssues,
      resolvedIssues,
      pendingIssues,
      inProgressIssues,
      avgResolutionTime
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    
    // Check if the user is admin or the reporter
    if (req.user.role !== 'admin' && issue.reporter.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this issue' });
    }

    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete issue' });
  }
};
