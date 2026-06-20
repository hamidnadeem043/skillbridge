import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Gig = () => {
  const { id } = useParams()
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [star, setStar] = useState(5)
  const [desc, setDesc] = useState('')
  const [reviewError, setReviewError] = useState('')
  const { currentUser } = useSelector(state => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGig = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`http://localhost:5000/api/gigs/single/${id}`)
        setGig(res.data)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
    fetchGig()
  }, [id])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${id}`)
        setReviews(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchReviews()
  }, [id])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewError('')

    try {
      const res = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          gigId: id,
          username: currentUser.username,
          star: Number(star),
          desc
        },
        { withCredentials: true }
      )
      setReviews(prev => [res.data, ...prev])
      setDesc('')
      setStar(5)
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Something went wrong!')
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!gig) return <div className="text-center py-20">Gig not found!</div>

  return (
    <div className="max-w-6xl mx-auto px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2">

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{gig.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              H
            </div>
            <div>
              <p className="font-semibold text-gray-800">Hamid Nadeem</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm">{gig.rating || 0}</span>
                <span className="text-sm text-gray-400">({gig.starNumber || 0} reviews)</span>
              </div>
            </div>
          </div>

          <img
            src={gig.coverImage || 'https://via.placeholder.com/800x400'}
            alt={gig.title}
            className="w-full rounded-xl mb-6 object-cover h-80"
          />

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About This Gig</h2>
            <p className="text-gray-600 leading-relaxed">{gig.description}</p>
          </div>

          {gig.features && gig.features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">What's Included</h2>
              <ul className="space-y-2">
                {gig.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* REVIEWS SECTION */}
          <div className="mb-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Reviews ({reviews.length})
            </h2>

            {/* Existing reviews */}
            <div className="flex flex-col gap-4 mb-8">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{r.username}</span>
                      <span className="text-yellow-400 text-sm">
                        {'⭐'.repeat(r.star)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{r.desc}</p>
                  </div>
                ))
              )}
            </div>

            {/* Review form — only logged in users */}
            {currentUser && currentUser._id !== gig.userId && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStar(n)}
                        className={`text-2xl ${n <= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500 resize-none"
                  />

                  {reviewError && (
                    <p className="text-red-500 text-sm">{reviewError}</p>
                  )}

                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 self-start px-6"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT — Order Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-lg">{gig.title}</h3>
              <span className="text-2xl font-bold text-green-600">${gig.price}</span>
            </div>

            <div className="flex gap-4 text-sm text-gray-500 mb-4">
              <span>⏱ {gig.deliveryTime} days delivery</span>
              <span>🔄 {gig.revisions} revisions</span>
            </div>

            <p className="text-gray-600 text-sm mb-6">{gig.description?.slice(0, 100)}...</p>

            {currentUser && currentUser._id !== gig.userId ? (
              <button
                onClick={() => navigate(`/pay/${gig._id}`)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Continue (${gig.price})
              </button>
            ) : !currentUser ? (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Login to Order
              </button>
            ) : (
              <button className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed">
                This is your gig
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

export default Gig