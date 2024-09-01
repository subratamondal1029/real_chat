import { Edit, Save } from 'lucide-react'
import React from 'react'

const ProfileDetail = ({editValue, startEdit, name, classname="", Icon}) => {
  return (
    <div className={`profileDetail ${classname}`}>
        <span className="detail">
          <Icon size={20} />
          <p>{editValue}</p>
        </span>
          <Edit size={20} className="editBtn" onClick={() => startEdit(name)} />
      </div>
  )
}

export default ProfileDetail