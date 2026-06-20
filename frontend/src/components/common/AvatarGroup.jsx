export default function AvatarGroup({ users = [] }) {
  return (
    <div className="flex -space-x-3">
      {users.map((user) => (
        <img
          key={user.id}
          src={user.avatar}
          alt={user.name}
          title={user.name}
          className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
        />
      ))}
    </div>
  )
}
