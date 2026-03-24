import { LocalSystemApiName } from '../..';
import { CreateAutomationInspector } from './CreateAutomation';
import { EditLocalFileInspector } from './EditLocalFile';
import { GlobLocalFilesInspector } from './GlobLocalFiles';
import { GrepContentInspector } from './GrepContent';
import { ListLocalFilesInspector } from './ListLocalFiles';
import { ReadLocalFileInspector } from './ReadLocalFile';
import { RenameLocalFileInspector } from './RenameLocalFile';
import { RunCommandInspector } from './RunCommand';
import { SearchLocalFilesInspector } from './SearchLocalFiles';
import { WriteLocalFileInspector } from './WriteLocalFile';

/**
 * Local System Inspector Components Registry
 */
export const LocalSystemInspectors = {
  [LocalSystemApiName.createAutomation]: CreateAutomationInspector,
  [LocalSystemApiName.editLocalFile]: EditLocalFileInspector,
  [LocalSystemApiName.globLocalFiles]: GlobLocalFilesInspector,
  [LocalSystemApiName.grepContent]: GrepContentInspector,
  [LocalSystemApiName.listLocalFiles]: ListLocalFilesInspector,
  [LocalSystemApiName.readLocalFile]: ReadLocalFileInspector,
  [LocalSystemApiName.renameLocalFile]: RenameLocalFileInspector,
  [LocalSystemApiName.runCommand]: RunCommandInspector,
  [LocalSystemApiName.searchLocalFiles]: SearchLocalFilesInspector,
  [LocalSystemApiName.writeLocalFile]: WriteLocalFileInspector,
};
