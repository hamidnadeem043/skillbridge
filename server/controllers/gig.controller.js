import Gig from '../models/Gig.js'

export const createGig = async (req, res) => {
  if (!req.isSeller) {
    return res.status(403).json({ message: 'Only sellers can create gigs!' })
  }

  const newGig = new Gig({
    userId: req.userId,
    ...req.body
  })

  try {
    const savedGig = await newGig.save()
    res.status(201).json(savedGig)
  } catch (error) {
    console.log('GIG ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) return res.status(404).json({ message: 'Gig not found!' })

    if (gig.userId !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own gigs!' })
    }

    await Gig.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Gig deleted successfully!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) return res.status(404).json({ message: 'Gig not found!' })
    res.status(200).json(gig)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getGigs = async (req, res) => {
  const { category, min, max, search, sort, userId } = req.query

  const filters = {
    ...(userId && { userId }),
    ...(category && { category }),
    ...(min && max && { price: { $gte: Number(min), $lte: Number(max) } }),
    ...(search && { title: { $regex: search, $options: 'i' } })
  }

  try {
    const gigs = await Gig.find(filters).sort({ [sort]: -1 })
    res.status(200).json(gigs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}