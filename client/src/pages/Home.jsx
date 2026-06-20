import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>

      {/* HERO SECTION */}
      <div className="bg-green-700 text-white py-20 px-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Find the perfect <span className="text-yellow-300">freelance</span> services for your business
          </h1>
          <p className="text-xl mb-8 text-green-100">
            Work with talented freelancers at the most affordable price
          </p>

          {/* Search Bar */}
          <div className="flex bg-white rounded-lg overflow-hidden max-w-2xl">
            <input
              type="text"
              placeholder="Search for any service..."
              className="flex-1 px-6 py-4 text-gray-800 outline-none text-lg"
            />
            <button className="bg-green-600 px-8 py-4 text-white font-semibold hover:bg-green-700">
              Search
            </button>
          </div>

          {/* Popular searches */}
          <div className="flex gap-3 mt-6 flex-wrap">
            <span className="text-green-200 text-sm">Popular:</span>
            {['Website Design', 'React', 'Node.js', 'Logo Design', 'SEO'].map(tag => (
              <Link
                key={tag}
                to={`/gigs?search=${tag}`}
                className="border border-green-300 text-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-600"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES SECTION */}
      <div className="py-16 px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Web Development', icon: '💻', color: 'bg-blue-100' },
              { name: 'Design & Creative', icon: '🎨', color: 'bg-pink-100' },
              { name: 'Digital Marketing', icon: '📱', color: 'bg-yellow-100' },
              { name: 'Writing & Translation', icon: '✍️', color: 'bg-green-100' },
              { name: 'Video & Animation', icon: '🎬', color: 'bg-purple-100' },
              { name: 'Music & Audio', icon: '🎵', color: 'bg-red-100' },
              { name: 'Data & Analytics', icon: '📊', color: 'bg-indigo-100' },
              { name: 'AI Services', icon: '🤖', color: 'bg-orange-100' },
            ].map(cat => (
              <Link
                key={cat.name}
                to={`/gigs?category=${cat.name}`}
                className={`${cat.color} p-6 rounded-xl hover:shadow-md transition cursor-pointer`}
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-16 px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            How FreelanceHub Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Find a Service', desc: 'Browse thousands of services from talented freelancers', icon: '🔍' },
              { step: '2', title: 'Place an Order', desc: 'Hire a freelancer and make secure payment via Stripe', icon: '🛒' },
              { step: '3', title: 'Get it Done', desc: 'Receive your work and approve to release payment', icon: '✅' },
            ].map(item => (
              <div key={item.step} className="text-center p-6">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-green-700 text-white py-16 px-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-green-100 mb-8 text-lg">Join thousands of freelancers and businesses</p>
        <div className="flex gap-4 justify-center">
          <Link
            to='/register'
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Join as Freelancer
          </Link>
          <Link
            to='/gigs'
            className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            Browse Services
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home