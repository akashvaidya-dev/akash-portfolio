import { useState } from 'react';
import LivingDevice from './LivingDevice';
import ProjectModal from './ProjectModal';

/**
 * ProjectCard Component
 * Wraps projects as 3D "Living Devices" with interactive screens,
 * phone/laptop form factors, real simulators, and case-study modals.
 */
function ProjectCard({ project, index = 0 }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <LivingDevice
        project={project}
        index={index}
        onOpenDetails={() => setModalOpen(true)}
      />

      {/* Case Study Deep-Dive Modal */}
      <ProjectModal
        project={project}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default ProjectCard;
