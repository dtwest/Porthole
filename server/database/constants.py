##
# NEVER EVER STORE CREDENTIALS IN PROD CODE
# USE A CREDENTIAL MANAGER / SOMETHING LIKE AWS SECRETS MANAGER
#
# THE CREDS ARE HERE BECAUSE THIS IS A TOY APP
##

database_name = "porthole"
database_root_user = "root"
database_root_password = database_name
database_server_connection_uri = f"mysql+mysqlconnector://{database_root_user}:{database_root_password}@mysqldb"
database_connection_uri = f"{database_server_connection_uri}/{database_name}"
