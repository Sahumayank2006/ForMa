const Child = require('../models/Child');
const User = require('../models/User');

// @desc    Get all children (filtered by role)
// @route   GET /api/children
// @access  Private
exports.getChildren = async (req, res, next) => {
  try {
    let query;

    // Mother can only see their own children
    if (req.user.role === 'mother') {
      query = Child.find({ mother: req.user.id });
    }
    // Caretaker can only see assigned children
    else if (req.user.role === 'caretaker') {
      query = Child.find({ assignedCaretaker: req.user.id });
    }
    // Admin can see all children
    else if (req.user.role === 'admin') {
      query = Child.find();
    }

    const children = await query
      .populate('mother', 'name email phone')
      .populate('assignedCaretaker', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: children.length,
      data: children
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single child
// @route   GET /api/children/:id
// @access  Private
exports.getChild = async (req, res, next) => {
  try {
    const child = await Child.findById(req.params.id)
      .populate('mother', 'name email phone profilePhoto')
      .populate('assignedCaretaker', 'name email phone profilePhoto');

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    // Check authorization
    if (req.user.role === 'mother' && child.mother._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this child'
      });
    }

    if (req.user.role === 'caretaker' && 
        (!child.assignedCaretaker || child.assignedCaretaker._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this child'
      });
    }

    res.status(200).json({
      success: true,
      data: child
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new child
// @route   POST /api/children
// @access  Private (Mother, Admin)
exports.createChild = async (req, res, next) => {
  try {
    // Set mother to current user if they're a mother
    if (req.user.role === 'mother') {
      req.body.mother = req.user.id;
    }

    // Validate mother ID
    if (!req.body.mother) {
      return res.status(400).json({
        success: false,
        message: 'Mother ID is required'
      });
    }

    // Create child
    const child = await Child.create(req.body);

    // Add child to mother's children array
    await User.findByIdAndUpdate(req.body.mother, {
      $push: { children: child._id }
    });

    // If caretaker assigned, add to caretaker's assignedChildren
    if (req.body.assignedCaretaker) {
      await User.findByIdAndUpdate(req.body.assignedCaretaker, {
        $push: { assignedChildren: child._id }
      });
    }

    const populatedChild = await Child.findById(child._id)
      .populate('mother', 'name email phone')
      .populate('assignedCaretaker', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedChild
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update child
// @route   PUT /api/children/:id
// @access  Private (Mother of child, Admin)
exports.updateChild = async (req, res, next) => {
  try {
    let child = await Child.findById(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    // Check authorization
    if (req.user.role === 'mother' && child.mother.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this child'
      });
    }

    // Handle caretaker reassignment
    if (req.body.assignedCaretaker && req.body.assignedCaretaker !== child.assignedCaretaker?.toString()) {
      // Remove from old caretaker
      if (child.assignedCaretaker) {
        await User.findByIdAndUpdate(child.assignedCaretaker, {
          $pull: { assignedChildren: child._id }
        });
      }
      // Add to new caretaker
      await User.findByIdAndUpdate(req.body.assignedCaretaker, {
        $push: { assignedChildren: child._id }
      });
    }

    child = await Child.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('mother', 'name email phone')
      .populate('assignedCaretaker', 'name email phone');

    res.status(200).json({
      success: true,
      data: child
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete child
// @route   DELETE /api/children/:id
// @access  Private (Admin only)
exports.deleteChild = async (req, res, next) => {
  try {
    const child = await Child.findById(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    // Remove from mother's children array
    await User.findByIdAndUpdate(child.mother, {
      $pull: { children: child._id }
    });

    // Remove from caretaker's assignedChildren
    if (child.assignedCaretaker) {
      await User.findByIdAndUpdate(child.assignedCaretaker, {
        $pull: { assignedChildren: child._id }
      });
    }

    await child.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add activity log to child
// @route   POST /api/children/:id/activity
// @access  Private (Caretaker, Admin)
exports.addActivityLog = async (req, res, next) => {
  try {
    const child = await Child.findById(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found'
      });
    }

    const activityLog = {
      timestamp: new Date(),
      activity: req.body.activity,
      detectedBy: req.body.detectedBy || 'manual',
      metadata: req.body.metadata || {}
    };

    child.activityLogs.push(activityLog);
    await child.save();

    res.status(200).json({
      success: true,
      data: child
    });
  } catch (error) {
    next(error);
  }
};
